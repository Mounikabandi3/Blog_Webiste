import React, { useState,useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import useFetch from './usefetch';

const BlogDetails = () => {
    const { id } = useParams();
    const { data: blog, error, isPending } = useFetch('http://localhost:8000/blogs/' + id);
    const history = useHistory();
    const [isEditMode, setIsEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [body, setBody] = useState('');

    // When blog data is fetched successfully, update state fields
    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setAuthor(blog.author);
            setBody(blog.body);
        }
    }, [blog]);

    const handleDelete = () => {
        fetch('http://localhost:8000/blogs/' + blog.id, {
            method: 'DELETE'
        }).then(() => {
            history.push('/');
        });
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setIsEditMode(false);
        // Revert changes if canceled
        setTitle(blog.title);
        setAuthor(blog.author);
        setBody(blog.body);
    };

    const handleSave = () => {
        fetch('http://localhost:8000/blogs/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                author,
                body
            })
        }).then(() => {
            setIsEditMode(false);
            // Optionally, you could refetch the blog details or trigger a state update
        }).catch(err => console.error('Error updating blog:', err));
    };

    return (
        <div className="create">
            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {blog && (
                <article>
                    {isEditMode ? (
                        <div>
                            <label>Title:</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            <label>Author:</label>
                            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                            <label>Body:</label>
                            <textarea value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                            <button onClick={handleCancel}  className="button-gap">Cancel</button>
                            <button onClick={handleSave}>Save Changes</button>
                        </div>
                    ) : (
                        <div>
                            <h2>{title}</h2>
                            <p>Written by {author}</p>
                            <div>{body}</div>
                            <button onClick={handleDelete}  className="button-gap">Delete</button>
                            <button onClick={handleEdit}>Edit</button>
                        </div>
                    )}
                </article>
            )}
        </div>
    );
};

export default BlogDetails;
