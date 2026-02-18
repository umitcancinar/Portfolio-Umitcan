
/**
 * Converts a GitHub blob URL to a raw content URL.
 * Example:
 * Input: https://github.com/user/repo/blob/main/image.png
 * Output: https://raw.githubusercontent.com/user/repo/main/image.png
 * 
 * @param {string} url - The URL to process
 * @returns {string} - The processed URL
 */
export const getRawGithubUrl = (url) => {
    if (!url) return "";

    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === "github.com" && urlObj.pathname.includes("/blob/")) {
            // Replace 'github.com' with 'raw.githubusercontent.com'
            // Remove '/blob' from path
            return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
        }
    } catch (e) {
        // If URL is invalid, just return authentic input
        return url;
    }

    return url;
};
