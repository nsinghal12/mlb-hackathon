import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.aside`
    min-width: 230px;
    width: 230px;
    max-width: 230px;
    border-right: 1px solid rgb(234, 234, 234);
    overflow-y: auto;
`;

const StyledLink = styled.a`
    display: block;
    padding: 6px 8px;
    padding-left: 32px;
    padding-right: 16px;
    line-height: 24px;
    font-size: 16px;
    text-decoration: none;
    color: gray;

    &:hover {
        background-color: #eee;
    }
`;

const AsideLink = ({ href, children }) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();

        navigate(href);
        return false;
    }

    return <StyledLink href={href} onClick={handleClick}>{children}</StyledLink>
}

const Sidebar = () => {
    return <Container>
        <AsideLink href='/'>Home</AsideLink>
        <AsideLink href='/download'>Download</AsideLink>
        <AsideLink href='/teams'>Teams</AsideLink>
        <AsideLink href='/games'>Games</AsideLink>
        <AsideLink href='/players'>Players</AsideLink>
        <AsideLink href='/analysis'>Analysis</AsideLink>
        <AsideLink href='/visualize'>Visualize</AsideLink>
        <AsideLink href='/digests'>Digest</AsideLink>
    </Container>
}

export default Sidebar;
