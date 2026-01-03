import React from "react";
import Layout from '../../components/Layout';
import { getPostBySlug, getAllPosts, markdownToHtml } from '../../lib/api';

const PostTemplate = ({ post }) => {
  return (
    <Layout>
      <section className="PostContainer">
        <div className="Post">
          <h1>{post.title}</h1>
          <h2>{post.date}</h2>
          <div
            className="PostContent"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
  ]);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

export default PostTemplate;
