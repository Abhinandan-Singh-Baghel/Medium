import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks"
import { Blog } from "./Blog";


export const Blogs = () => {
    const { loading , blogs } = useBlogs();

    if(loading){
        return <div>
            <Appbar />
            <div className="flex justify-center">
                <div>
                    <BlogSkeleton/>
                    <BlogSkeleton/>
                    <BlogSkeleton/>
                    <BlogSkeleton/>
                    <BlogSkeleton/>
                    
                </div>
            </div>
        </div>
    }

    return <div>
    <Appbar/>
    <div className="flex justify-center">
        <div>
            {blogs.map(blog => <BlogCard
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={"26th Mar 2024"}
                 />)}
        </div>
    </div>
</div>
}


