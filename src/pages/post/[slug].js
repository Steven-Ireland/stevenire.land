import React from "react";
import Layout from '../../components/Layout';
import Head from 'next/head';
import { getPostBySlug, getAllPosts, markdownToHtml } from '../../lib/api';

const PostTemplate = ({ post }) => {
  const description = post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...';

  return (
    <Layout>
      <Head>
        <title key="title">{`${post.title} | Steven Ireland`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
      </Head>
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
