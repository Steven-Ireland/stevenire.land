import React from "react";
import Link from "next/link";
import Layout from '../../components/Layout';
import { getAllPosts } from '../../lib/api';

const PostPreview = ({ title, date, excerpt, slug }) => (
  <div className = "PostPreviewContainer">
    <Link href={`/post/${slug}`}>
        <div className = "PostPreview">
          <div className="Header">
            <h1>{title}</h1>
            <h2>{date}</h2>
          </div>
          <p>{excerpt}</p>
        </div>
    </Link>
  </div>
);

const Home = ({ allPosts }) => {
  return (
    <Layout>
      <section className="PostListing">
        {allPosts.map((post) => (
          <PostPreview key={post.slug} {...post} />
        ))}
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'excerpt', // Will be undefined currently, I need to fix this in lib/api.js
    'content' // Needed to generate excerpt if I do it here
  ]);
  
  // Generate simple excerpt if not present
  const postsWithExcerpt = allPosts.map(post => {
      let excerpt = post.excerpt;
      if (!excerpt && post.content) {
          // Simple truncation
          excerpt = post.content.replace(/[#*`]/g, '').slice(0, 200) + '...';
      }
      // Remove content to save JSON size
      const { content, ...rest } = post;
      return { ...rest, excerpt };
  });

  return {
    props: { allPosts: postsWithExcerpt },
  };
}

export default Home;