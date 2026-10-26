import { useState, useEffect } from 'react';
import { PROFILE_DATA } from '../data/portfolioData';

export function useGithubTelemetry(username = 'Mayoranz') {
  const [telemetry, setTelemetry] = useState({
    loading: true,
    isLive: false,
    user: {
      login: PROFILE_DATA.handle,
      name: PROFILE_DATA.fullName,
      avatar_url: PROFILE_DATA.avatarUrl,
      public_repos: PROFILE_DATA.stats.publicRepos,
      followers: PROFILE_DATA.stats.followers,
      following: PROFILE_DATA.stats.following,
      updated_at: '2026-10-16T08:45:08Z',
    },
    recentRepos: [],
    languageBreakdown: [
      { lang: 'JavaScript', count: 10, percent: 38, color: '#C5B396' },
      { lang: 'HTML / CSS', count: 7, percent: 26, color: '#9E9078' },
      { lang: 'Python / Blade / PHP', count: 5, percent: 19, color: '#787166' },
      { lang: 'Dart (Flutter) & TS', count: 4, percent: 17, color: '#EDEAE4' },
    ],
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchTelemetry() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          throw new Error('GitHub API rate limit or network fallback');
        }

        const userData = await userRes.json();
        const reposData = await reposRes.json();

        if (!isMounted) return;

        const excludedRepos = new Set(['smakzie', 'api-ziepoint', 'tumbler-smakzie']);
        const filteredRepos = Array.isArray(reposData)
          ? reposData.filter((r) => !excludedRepos.has(String(r.name || '').toLowerCase()))
          : [];

        // Calculate language counts dynamically from live public repos
        const langMap = {};
        let totalWithLang = 0;
        filteredRepos.forEach((repo) => {
          if (repo.language) {
            langMap[repo.language] = (langMap[repo.language] || 0) + 1;
            totalWithLang += 1;
          }
        });

        const palette = ['#C5B396', '#EDEAE4', '#9E9078', '#787166', '#5C574F'];
        const dynamicLangs = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([lang, count], idx) => ({
            lang,
            count,
            percent: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 20,
            color: palette[idx % palette.length],
          }));

        setTelemetry({
          loading: false,
          isLive: true,
          user: {
            login: userData.login || PROFILE_DATA.handle,
            name: userData.name || PROFILE_DATA.fullName,
            avatar_url: userData.avatar_url || PROFILE_DATA.avatarUrl,
            public_repos: userData.public_repos ?? PROFILE_DATA.stats.publicRepos,
            followers: userData.followers ?? PROFILE_DATA.stats.followers,
            following: userData.following ?? PROFILE_DATA.stats.following,
            updated_at: userData.updated_at || '2026-10-16T08:45:08Z',
          },
          recentRepos: filteredRepos.slice(0, 8),
          languageBreakdown:
            dynamicLangs.length > 0 ? dynamicLangs : telemetry.languageBreakdown,
        });
      } catch {
        if (isMounted) {
          setTelemetry((prev) => ({ ...prev, loading: false, isLive: false }));
        }
      }
    }

    fetchTelemetry();

    return () => {
      isMounted = false;
    };
  }, [username]);

  return telemetry;
}
