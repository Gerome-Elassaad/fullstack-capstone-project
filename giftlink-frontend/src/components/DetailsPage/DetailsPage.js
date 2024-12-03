import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }

        // Fetch gift details
        const fetchGift = async () => {
            try {
                const response = await fetch(`/api/gifts/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${authenticationToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch gift: ${response.statusText}`);
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message || 'Error fetching gift details.');
            } finally {
                setLoading(false);
            }
        };

        fetchGift();
        // Scroll to top on component mount
        window.scrollTo(0, 0);
    }, [productId, navigate]);

    const handleBackClick = () => {
        // Navigate back to the previous page
        navigate(-1);
    };

    const comments = [
        { author: 'John Doe', comment: 'I would like this!' },
        { author: 'Jane Smith', comment: 'Just DMed you.' },
        { author: 'Alice Johnson', comment: 'I will take it if it\'s still available.' },
        { author: 'Mike Brown', comment: 'This is a good one!' },
        { author: 'Sarah Wilson', comment: 'My family can use one. DM me if it is still available. Thank you!' },
    ];

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!gift) return <div className="not-found">Gift not found</div>;

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
                            <img
                                src={`/images/${gift.image}`}
                                alt={gift.name}
                                className="product-image-large"
                            />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {new Date(gift.date_added * 1000).toLocaleDateString()}</p>
                    <p><strong>Age (Years):</strong> {gift.age_years.toFixed(2)}</p>
                    <p><strong>Description:</strong> {gift.description}</p>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailsPage;
