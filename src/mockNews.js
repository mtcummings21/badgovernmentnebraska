// Sample headlines used when the RSS feeds in src/news.js can't be reached.
// These are clearly fictional placeholders, not real articles, and link to
// each outlet's homepage rather than a fabricated article URL.

const mockNews = [
  {
    id: "mock-news-1",
    title: "[Sample] Legislature advances property tax relief package to Select File",
    link: "https://nebraskaexaminer.com",
    source: "Nebraska Examiner",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    snippet: "Placeholder summary for prototype purposes \u2014 real headlines load here once the RSS feed is reachable.",
  },
  {
    id: "mock-news-2",
    title: "[Sample] State auditor flags spending gaps at two agencies",
    link: "https://flatwaterfreepress.org",
    source: "Flatwater Free Press",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    snippet: "Placeholder summary for prototype purposes \u2014 real headlines load here once the RSS feed is reachable.",
  },
  {
    id: "mock-news-3",
    title: "[Sample] Committee hearing draws crowd over groundwater bill",
    link: "https://nebraskaexaminer.com",
    source: "Nebraska Examiner",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    snippet: "Placeholder summary for prototype purposes \u2014 real headlines load here once the RSS feed is reachable.",
  },
  {
    id: "mock-news-4",
    title: "[Sample] Investigation examines child support payment delays",
    link: "https://flatwaterfreepress.org",
    source: "Flatwater Free Press",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    snippet: "Placeholder summary for prototype purposes \u2014 real headlines load here once the RSS feed is reachable.",
  },
];

module.exports = { mockNews };
