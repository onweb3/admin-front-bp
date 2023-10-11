import React, { memo, useRef } from "react";
import JoditEditor from "jodit-react";


const RichTextEditor = ({ initialValue, getValue }) => {
    const editor = useRef(null);

    return (
       
        <JoditEditor
            ref={editor}
            value={initialValue}
            tabIndex={1}
            onBlur={(newContent) => getValue(newContent)}
        />
    );
};

export default memo(RichTextEditor);
