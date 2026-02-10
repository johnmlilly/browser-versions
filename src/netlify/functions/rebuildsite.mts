import type { Config } from '@netlify/functions'

// Stop TypeScript from complaining about
// the missing process.env.NETLIFY_REBUILD_HOOK
declare var process : {
    env: {
        NETLIFY_REBUILD_HOOK: string
    }
}

// An asynchronous function to call
// the Netlify build hook to rebuild your site
const rebuildSite = async (triggerTitle: string) => {
    // Construct the URL for the Netlify rebuild hook
    const url = new URL(process.env.NETLIFY_REBUILD_HOOK);

    // Add the title to the query string
    url.searchParams.append('trigger_title', triggerTitle);

    // Make a POST request to the Netlify webhook
    return await fetch(url.toString(), {
        method: 'POST',
    });
};

// Always update your footer every year! :)
export default async (request: Request) => {
    await rebuildSite('Daily build to get latest browser versions');
};

// Netlify scheduled function cron syntax
// Run every 24 hours
export const config: Config = {
  schedule: '0 0 * * *'
};