
import Card from '../../Components/Card/Card'
import { games } from './data'
import './Home.css';

function Home () {

    return (
        <div className="homepage">
            {
                games.map((e, index) => {
                    return <Card 
                        key={index}
                        title={e.title}
                        description = {e.description}
                        logo={e.logo}
                        sourceBg={e.sourceBg}
                    />
                })
            }
        </div>
    );
}

export default Home