import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import { Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Download from './pages/Download';
import ViewTeams from './pages/ViewTeams';
import ViewGames from './pages/ViewGames';
import ViewPlayers from './pages/ViewPlayers';
import ViewDigestList from './pages/ViewDigestList';
import CreateDigest from './pages/CreateDigest';
import Analysis from './pages/Analysis';
import ViewDigest from './pages/ViewDigest';

const Page = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const TwoCols = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: hidden;
`;

const StyledMain = styled.main`
    padding: 40px;
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    padding-bottom: 96px;
`;

const AppWithRoutes = () => {
    return <Page>
        <Header />
        <TwoCols className='page-content'>
            <Sidebar />
            <StyledMain>
                <Routes>
                    <Route path='/' element={<Welcome />} />
                    <Route path='/download' element={<Download />} />
                    <Route path='/teams' element={<ViewTeams />} />
                    <Route path='/games' element={<ViewGames />} />
                    <Route path='/players' element={<ViewPlayers />} />
                    <Route path='/analysis' element={<Analysis />} />
                    <Route path='/digests' element={<ViewDigestList />} />
                    <Route path='/digests/:digestId' element={<ViewDigest />} />
                    <Route path='/digests/create' element={<CreateDigest />} />
                </Routes>
            </StyledMain>
        </TwoCols>
    </Page>
}

export default AppWithRoutes;
