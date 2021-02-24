import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from 'react'
import styles from '../../styles/Home.module.scss'

const BLOG_URL = process.env.BLOG_URL
const CONTENT_API_KEY = process.env.CONTENT_API_KEY

async function fetchPost(slug: string) {
    const res = await fetch(
        `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html,created_at`
      ).then((res) => res.json())
    
      const posts = res.posts
    
      return posts[0]
}

export const getStaticProps = async ({ params }) => {
    const post = await fetchPost(params.slug)
    return {
      props: { post }
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

type Post = {
    title: string
    html: string
    slug: string
}

const Post: React.FC<{post: Post}> = (props) => {

    const { post } = props
    const [enableLoadComments, setEnableLoadComments] = useState<boolean>
    (true)
    const router = useRouter()

    if (router.isFallback) {
        return (
            <div className={styles.container}>
                <h1> Loading the post! </h1>
            </div>
        )
    }

    function loadComments() {

        setEnableLoadComments(false)

        ;(window as any).disqus_config = function () {
            this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = post.slug; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
            };

            const script = document.createElement("script")
            script.src = "https://blog-arturserra.disqus.com/embed.js"
            script.setAttribute('data-timestamp', Date.now().toString());

            document.body.appendChild(script)
    } 
    
	return (
		<div className={styles.container}>
			<p className={styles.goback}>
				<Link href="/">
					<a>Go back</a>
				</Link>
			</p>
			<h1>{post.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: post.html }}></div>

            {enableLoadComments && (
                <p className={styles.goback} onClick={loadComments}> 
                    Load comments
                </p>
            )}


            <div id="disqus_thread"></div>
        </div>
    )
}

export default Post