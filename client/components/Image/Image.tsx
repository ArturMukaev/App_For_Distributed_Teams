import React, { useState } from 'react';
import {serverUrl} from "../../helpers/helper";

const defaultSrc = `${serverUrl}/no_image.png`;

type ImageProps = {
    src: string;
};

function Image({src} : ImageProps): JSX.Element {
    const [imageSrc, setImageSrc] = useState<string>(src);

    const handleImageError = () => {
        setImageSrc(defaultSrc);
    };

    return (
        <img src={imageSrc} onError={handleImageError} alt="картинка" />
    );
}

export default Image;