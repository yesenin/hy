import { useState } from "react";
import TextWordTile from "../components/TextWordTile";
import type { TileAnimation } from "../types";

function Showcase() {
    const [animation, setAnimation] = useState<TileAnimation>('idle');
    const [disabled, setDisabled] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <div className="flex flex-com">
            <div>
                <h2>Word tile</h2>
                <div>
                    <TextWordTile 
                        withSound={true}
                        word={{id: '1', value: 'Anton Yesenin'}}
                        animation={animation}
                        disabled={disabled}
                        active={selected}
                        onClick={() => setSelected(!selected)}
                    />
                </div>
                <div>
                    <button type="button" onClick={() => setAnimation('idle')}>idle</button>
                    <button type="button" onClick={() => setAnimation('wrong')}>Wrong</button>
                    <button type="button" onClick={() => setAnimation('correct')}>Correct</button>
                    <button type="button" onClick={() => setAnimation('leave')}>Disappear</button>
                    <button type="button" onClick={() => setAnimation('new')}>Appear</button>
                    <button type="button" onClick={() => setDisabled(!disabled)}>Disabled/Enabled</button>
                    <button type="button" onClick={() => {
                        setAnimation('active');
                    }}>Selected/None</button>
                </div>
            </div>
        </div>
    )
}

export default Showcase;