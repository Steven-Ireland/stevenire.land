import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
      return;
    }
    if (field === 'content') {
      items[field] = content;
      return;
    }
    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export async function markdownToHtml(markdown) {
  // Handle custom video embeds from Gatsby legacy
  // Syntax: `youtube: id` or `twitch: id`
  
  const youtubeRegex = /`youtube: ([a-zA-Z0-9_-]+)`/g;
  const twitchRegex = /`twitch: ([a-zA-Z0-9_-]+)`/g; // Maps to local mp4

  let content = markdown;
  
  content = content.replace(youtubeRegex, (match, id) => {
      return `<div class="embedVideo-container"><iframe width="800" height="450" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  });

  content = content.replace(twitchRegex, (match, id) => {
      return `<div class="embedVideo-container"><video width="800" controls><source src="/${id}.mp4" type="video/mp4">Your browser does not support the video tag.</video></div>`;
  });

  const result = await remark()
    .use(html, { sanitize: false })
    .use(prism)
    .process(content);
  return result.toString();
}