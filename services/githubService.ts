import { GitHubUser, AppFile } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

const commonHeaders = (token: string) => ({
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
});

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `GitHub API request failed with status ${response.status}`);
    }
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      return { success: true };
    }
    return response.json();
};

export const getUser = async (token: string): Promise<GitHubUser> => {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: commonHeaders(token),
    });
    return handleResponse(response);
};

export const createRepo = async (token: string, repoName: string, description: string): Promise<any> => {
    const response = await fetch(`${GITHUB_API_BASE}/user/repos`, {
        method: 'POST',
        headers: commonHeaders(token),
        body: JSON.stringify({
            name: repoName,
            description: `AI-generated app for: ${description}`,
            private: false,
            auto_init: true, // Creates an initial commit, which we can then build upon
        }),
    });
    return handleResponse(response);
};

// Helper to get the SHA of the latest commit on a branch
const getLatestCommitSha = async (token: string, owner: string, repo: string, branch: string = 'main'): Promise<string> => {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
        headers: commonHeaders(token),
    });
    const data = await handleResponse(res);
    // For a new repo with auto_init, the initial commit is on master, not main
    if (data.ref === `refs/heads/${branch}`) {
        return data.object.sha;
    }
    // Fallback for repos that might initialize with 'master'
    const masterRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/master`, {
      headers: commonHeaders(token),
    });
    const masterData = await handleResponse(masterRes);
    return masterData.object.sha;
};

// Orchestrator for committing multiple files
export const commitMultipleFiles = async (token: string, owner: string, repo: string, files: AppFile, message: string): Promise<any> => {
    // 1. Get the latest commit SHA
    const latestCommitSha = await getLatestCommitSha(token, owner, repo);
    const baseCommitResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, {
        headers: commonHeaders(token),
    });
    const baseCommit = await handleResponse(baseCommitResponse);
    const baseTreeSha = baseCommit.tree.sha;

    // 2. Create a blob for each file
    const blobPromises = Object.entries(files).map(([filename, content]) =>
        fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs`, {
            method: 'POST',
            headers: commonHeaders(token),
            body: JSON.stringify({
                content: btoa(unescape(encodeURIComponent(content))),
                encoding: 'base64',
            }),
        }).then(handleResponse).then(blob => ({
            path: filename,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blob.sha,
        }))
    );
    const treeItems = await Promise.all(blobPromises);

    // 3. Create a new tree
    const treeResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees`, {
        method: 'POST',
        headers: commonHeaders(token),
        body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: treeItems,
        }),
    });
    const newTree = await handleResponse(treeResponse);

    // 4. Create a new commit
    const commitResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits`, {
        method: 'POST',
        headers: commonHeaders(token),
        body: JSON.stringify({
            message,
            tree: newTree.sha,
            parents: [latestCommitSha],
        }),
    });
    const newCommit = await handleResponse(commitResponse);

    // 5. Update the branch reference (e.g., main) to point to the new commit
    // GitHub may create 'master' by default on older accounts, check for 'main' first.
    let branch = 'main';
    const mainRefCheck = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/branches/main`, { headers: commonHeaders(token) });
    if (!mainRefCheck.ok) {
        branch = 'master'; // Fallback to master if main doesn't exist
    }

    const updateRefResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers: commonHeaders(token),
        body: JSON.stringify({
            sha: newCommit.sha,
        }),
    });

    return handleResponse(updateRefResponse);
};
