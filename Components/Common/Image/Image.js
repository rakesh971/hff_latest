import React, { useEffect, useState } from "react";
import { Api } from "../../../Common/Api";

const Image = React.forwardRef(({ image, className, alt = "image",style },ref) => {

        const [img, setImg] = useState("");

        useEffect(() => {
            setImg(Api.imageUrl(image.url))
        }, []);

        return <img src={img} style={style} className={className} alt={alt} ref={ref} />;
});

export default Image;
