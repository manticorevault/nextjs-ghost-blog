import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Link from "next/link";

const BLOG_URL = process.env.BLOG_URL
const CONTENT_API_KEY = process.env.CONTENT_API_KEY

type Post = {
  title: string
  slug: string
}

async function fetchPosts() {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt,reading_time`
  ).then((res) => res.json())

  const posts = res.posts

  return posts
}

export const getStaticProps = async ({ params }) => {
  const posts = await fetchPosts()
  return {
    props: { posts },
	revalidate: 30
  }
}

const Home: React.FC<{ posts: Post[] }> = (props) => {
	const { posts } = props

	return (
		<div className={styles.container}>
			<h1>Artur Serra's blog</h1>
			<ul>
				{posts.map((post, index) => {
					return (
						<li key={post.slug}>
							<Link href="/post/[slug]" as={`/post/${post.slug}`}>
								<a>{post.title}</a>
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Home