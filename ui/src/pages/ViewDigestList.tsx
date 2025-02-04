import React from 'react';
import * as Service from '../Service';
import { useNavigate } from 'react-router-dom';

const ViewDigestList = () => {
    const naviagte = useNavigate();

    const [digests, setDigests] = React.useState<Array<any> | undefined>();

    React.useEffect(() => {
        const fetchDigests = async () => {
            const digests: Array<any> = await Service.getDigestList();
            setDigests(digests);
        };

        fetchDigests();
    }, []);

    if (!digests) {
        return <p>Loading...</p>;
    }

    return <>
        <h2>Digests</h2>

        <br />
        <a href='/digests/create' className='btn btn-primary'>Create Digest</a>

        <br /><br />
        {digests.length === 0 && <div className='alert alert-info'>No digests found</div>}

        {digests.length > 0 &&
            <table className="table">
                <thead>
                    <tr>
                        <th>Created</th>
                        <th>Duration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        digests.map((digest) => {
                            return <tr key={digest.id} >
                                <td>{digest.date}</td>
                                <td>{digest.duration}</td>
                                <td>
                                    <a href='#' onClick={() => {
                                        naviagte(`/digests/${digest.id}`);
                                        return false;
                                    }} className='btn btn-sm btn-primary'>View</a>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        }
    </>
}

export default ViewDigestList;
