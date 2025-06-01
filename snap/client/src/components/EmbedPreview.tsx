
'use client';

import React, { useEffect } from 'react';

interface EmbedPreviewProps {
    url: string;
}

const EmbedPreview: React.FC<EmbedPreviewProps> = ({ url }) => {
    const isYouTube = /youtube\.com|youtu\.be/.test(url);
    const isTwitter = /twitter\.com|x\.com/.test(url);
    const isInstagram = /instagram\.com/.test(url);

    useEffect(() => {
        if (isTwitter || isInstagram) {
            const script = document.createElement('script');
            script.async = true;

            if (isTwitter) {
                script.src = 'https://platform.twitter.com/widgets.js';
            } else if (isInstagram) {
                script.src = 'https://www.instagram.com/embed.js';
            }

            document.body.appendChild(script);
        }
    }, [url]);

    if (isYouTube) {
        const videoId = url.includes('watch?v=')
            ? url.split('watch?v=')[1].split('&')[0]
            : url.split('/').pop();
        return (
            <div className="aspect-video w-full">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full rounded"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        );
    }

    if (isTwitter) {
        return (
            <blockquote className="twitter-tweet">
                <a href={url}></a>
            </blockquote>
        );
    }

    if (isInstagram) {
        return (
            <blockquote className="instagram-media" data-instgrm-permalink={url} />
        );
    }

    return null;
};

export default EmbedPreview;
