
import Card from '../../Components/Card/Card'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import { games } from './data'
import '../../assets/styles/Home.css';

function Home () {

    return (
        <div className="homepage">
            {
                games.map((e, index) => {
                    return <Card 
                        key={index}
                        title={e.name}
                        tags={e.tags}
                        description = {e.description}
                        source={e.source}
                    />
                })
            }
            <GoTopBtn />
        </div>
    );
}

export default Home