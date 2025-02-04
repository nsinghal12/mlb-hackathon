import React from 'react';
import * as Service from '../Service';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Markdown from 'react-markdown'

const Container = styled.div`
    width: 60%;
    margin: 0 auto;

    img {
        object-fit: contain;
        max-width: 100%;
    }

    h1, h2, h3, h4 {
        text-align: center;
    }
`;

function isLikelyMarkdown(str) {
    const markdownElements = [
        /^(#+)\s/, // Headers
        /^\* |\- |\+ /, // Unordered lists
        /^\d+\. /, // Ordered lists
        /\[.*\]\(.*\)/, // Links
        /\*\*.*\*\*/, // Bold
        /\*.*\*/, // Italic
        /```/, // Code blocks
    ];

    for (const pattern of markdownElements) {
        if (pattern.test(str)) {
            return true;
        }
    }

    return false;
}

function renderContent(content) {
    if (isLikelyMarkdown(content)) {
        return <Markdown>{content}</Markdown>;
    }

    return <p>{content}</p>;
}

const ViewDigest = () => {
    const { digestId } = useParams();

    const [digest, setDigest] = React.useState<any | undefined>();

    React.useEffect(() => {
        const fetchDigest = async () => {
            const digest: any = await Service.getDigest(digestId);
            console.log('digest', digest);
            setDigest(digest);
        };

        fetchDigest();
    }, [digestId]);

    if (!digestId) {
        return <div className='alert alert-danger'>
            Digest not found.
        </div>
    }

    if (!digest) {
        return <p>Loading...</p>;
    }

    const { details } = digest;
    return <Container>
        <h1>Your MLB fan digest for {digest.date}</h1>

        {
            details.map((detail: any) => {
                return <>
                    <h2>{detail.name}</h2>
                    <h3>Season Recap</h3>
                    <img src={detail.teamDigest.recap.image.image} alt={detail.teamDigest.recap.image.title} />
                    <p>{detail.teamDigest.recap.para}</p>

                    <h3>Digest from last {digest.duration}</h3>
                    {
                        detail.teamDigest.currentGames.map(game => {
                            return <>
                                <h4>{game.name} ({game.score})</h4>
                                <img src={game.imageUrl} alt={game.imageText} />
                                <p>
                                    {renderContent(game.llmSummary) }
                                </p>
                            </>
                        })
                    }
                </>
            })
        }

    </Container>
}

export default ViewDigest;
