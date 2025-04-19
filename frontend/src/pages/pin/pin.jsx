import { Button } from 'bootstrap';
import './pin.css'

function Pin({ button, setButton }) {
    return (
        <div className='center-marker'
            style={
                {
                    position: 'absolute',
                    top: '49%', 
                    left: '48.5%',
                    // left: '50%',
                    // transform: 'translate(-50%, -50%)',
                    zIndex: '1001',
                    fontSize: '24px',
                    display: (button === 'a' || button === 'b' ? 'flex' : 'none'),
                }
            }>
            <i className={(button === 'a' ? 'bi bi-geo-alt-fill red' : 'bi bi-geo-alt-fill green')}></i>
        </div>
    );
}

export default Pin;