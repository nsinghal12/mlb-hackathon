import React from 'react';
import styled from 'styled-components';

const Container = styled.header`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 20px;
    background-color: rgb(248, 248, 248);
    height: 47px;
    min-height: 47px;
    max-height: 47px;
    border-bottom: 1px solid rgb(234, 234, 234);
    gap: 10px;

    [data-testid='header-tabs'] [role='tab'] {
        cursor: pointer;
    }
`;

const AppName = styled.span`
    font-size: 18px;
    font-weight: bold;
`;

const Header = () => {
    return <Container className='app-header'>
        <AppName style={{ paddingRight: '20px' }}>
            MLB Hackathon
        </AppName>
    </Container>
}

export default Header;
