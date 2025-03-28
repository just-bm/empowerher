import React, { useState, useEffect } from "react";
import { FaHeart, FaComment, FaTrash, FaPaperPlane, FaUsers, FaShieldAlt } from "react-icons/fa";
import "./CommunityPage.css";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [commentContent, setCommentContent] = useState({});
  const [nextCommentId, setNextCommentId] = useState(1);
  const [postSuccess, setPostSuccess] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("forum");

  // Load sample data
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts([
        {
          id: 1,
          content: "Welcome to our community safety forum! Post your concerns or safety tips here.",
          timestamp: new Date().toISOString(),
          comments: [
            {
              commentId: 1,
              content: "Great initiative! Let's keep our neighborhood safe.",
              timestamp: new Date().toISOString(),
              author: "Neighbor123"
            }
          ],
          likes: 5,
          author: "Admin"
        },
        {
          id: 2,
          content: "Suspicious activity reported near Main Street park after dark. Please be cautious.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          comments: [],
          likes: 3,
          author: "SafetyPatrol"
        }
      ]);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      content: newPostContent,
      timestamp: new Date().toISOString(),
      comments: [],
      likes: 0,
      author: "You"
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setPostSuccess(true);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const content = commentContent[postId] || "";
    if (!content.trim()) return;

    const newComment = {
      commentId: nextCommentId,
      content: content,
      timestamp: new Date().toISOString(),
      author: "You"
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] } 
        : post
    ));

    setCommentContent({ ...commentContent, [postId]: "" });
    setNextCommentId(nextCommentId + 1);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => setPostSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [postSuccess]);

  return (
    <div className="community-page">
      <header className="community-header">
        <div className="header-content">
          <h1><FaShieldAlt className="header-icon" /> Community Safety Hub</h1>
          <p>Connect with neighbors and share safety information</p>
        </div>
      </header>

      <div className="community-tabs">
        <button 
          className={`tab-button ${activeTab === "forum" ? "active" : ""}`}
          onClick={() => setActiveTab("forum")}
        >
          <FaComment /> Discussion Forum
        </button>
        <button 
          className={`tab-button ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          <FaUsers /> Safety Resources
        </button>
      </div>

      <main className="community-content">
        {activeTab === "forum" ? (
          <>
            {postSuccess && (
              <div className="alert success">
                Your post has been shared with the community!
              </div>
            )}

            <section className="new-post-section">
              <form onSubmit={handlePostSubmit} className="post-form">
                <div className="form-group">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share a safety concern, tip, or neighborhood update..."
                    rows="3"
                    required
                  />
                </div>
                <button type="submit" className="post-button">
                  <FaPaperPlane /> Post
                </button>
              </form>
            </section>

            <section className="posts-section">
              {isLoading ? (
                <div className="loading">Loading community posts...</div>
              ) : posts.length === 0 ? (
                <div className="empty-state">
                  <p>No posts yet. Be the first to share!</p>
                </div>
              ) : (
                <ul className="posts-list">
                  {posts.map(post => (
                    <li key={post.id} className="post-card">
                      <div className="post-header">
                        <span className="author">{post.author}</span>
                        <span className="timestamp">{formatTimestamp(post.timestamp)}</span>
                      </div>
                      <div className="post-content">{post.content}</div>
                      
                      <div className="post-actions">
                        <button 
                          className={`action-button like ${post.likes > 0 ? 'liked' : ''}`}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <FaHeart /> {post.likes > 0 ? post.likes : ''}
                        </button>
                        <button 
                          className="action-button comment"
                          onClick={() => toggleComments(post.id)}
                        >
                          <FaComment /> {post.comments.length > 0 ? post.comments.length : ''}
                        </button>
                        {post.author === "You" && (
                          <button 
                            className="action-button delete"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>

                      <form 
                        onSubmit={(e) => handleCommentSubmit(e, post.id)} 
                        className="comment-form"
                      >
                        <input
                          type="text"
                          value={commentContent[post.id] || ""}
                          onChange={(e) => setCommentContent({
                            ...commentContent,
                            [post.id]: e.target.value
                          })}
                          placeholder="Add a comment..."
                        />
                        <button type="submit" className="comment-button">
                          <FaPaperPlane />
                        </button>
                      </form>

                      {showComments[post.id] && post.comments.length > 0 && (
                        <div className="comments-container">
                          {post.comments.map(comment => (
                            <div key={comment.commentId} className="comment">
                              <div className="comment-header">
                                <span className="author">{comment.author}</span>
                                <span className="timestamp">{formatTimestamp(comment.timestamp)}</span>
                              </div>
                              <div className="comment-content">{comment.content}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : (
          <section className="resources-section">
            <h2>Community Safety Resources</h2>
            <div className="resource-cards">
              <div className="resource-card">
                <h3><FaUsers /> Neighborhood Watch</h3>
                <p>Join our local neighborhood watch program to help keep our community safe.</p>
                <button className="resource-button">Learn More</button>
              </div>
              <div className="resource-card">
                <h3><FaShieldAlt /> Emergency Contacts</h3>
                <p>Important phone numbers and contacts for local safety services.</p>
                <button className="resource-button">View Contacts</button>
              </div>
              <div className="resource-card">
                <h3><FaShieldAlt /> Safety Tips</h3>
                <p>Learn best practices for home and personal safety in our community.</p>
                <button className="resource-button">Read Tips</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CommunityPage;