import React, { useState, useContext, useRef, useEffect } from 'react';
import { CartContext } from '../CartContext';
import { Stage, Layer, Rect, Image as KonvaImage, Text, Transformer, Group } from 'react-konva';
import useImage from 'use-image';

// --- Csak a Pólót színező komponens (JAVÍTVA: Bekerült a name="tshirt-base") ---
const TshirtBase = ({ color }) => {
    const [image] = useImage('/img/blank-tshirt.png');
    if (!image) return null;

    return (
        <Group>
            {/* Az alap fehér póló */}
            <KonvaImage image={image} width={400} height={500} name="tshirt-base" />
            
            {/* A Szín, amit ráhúzunk */}
            {color !== '#ffffff' && (
                <Rect width={400} height={500} fill={color} globalCompositeOperation="multiply" name="tshirt-base" />
            )}
            
            {/* Maszkolás */}
            <KonvaImage image={image} width={400} height={500} globalCompositeOperation="destination-in" name="tshirt-base" />
        </Group>
    );
};

// --- Árnyék réteg a minták fölé ---
const TshirtMask = () => {
    const [image] = useImage('/img/blank-tshirt.png');
    if (!image) return null;
    return (
        <KonvaImage 
            image={image} 
            width={400} 
            height={500} 
            globalCompositeOperation="multiply" 
            listening={false} 
            opacity={0.9} 
        />
    );
};

// --- Mozgatható Minta ---
const DraggableImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const trRef = useRef();
    const [img] = useImage(shapeProps.src);

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <KonvaImage
                image={img}
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })}
                onTransformEnd={() => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY),
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => newBox} />}
        </React.Fragment>
    );
};

// --- Mozgatható Szöveg ---
const DraggableText = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Text
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })}
                onTransformEnd={() => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        fontSize: Math.max(10, node.fontSize() * scaleX),
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && <Transformer ref={trRef} enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']} />}
        </React.Fragment>
    );
};

// ==========================================
// FŐ KOMPONENS: A PÓLÓTERVEZŐ
// ==========================================
export default function Tervezo() {
    const { addToCart } = useContext(CartContext);
    const stageRef = useRef();

    const [tshirtColor, setTshirtColor] = useState('#ffffff');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedId, setSelectedId] = useState(null); 
    
    const [designImage, setDesignImage] = useState(null);
    const [customText, setCustomText] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setDesignImage({ src: event.target.result, x: 150, y: 150, width: 100, height: 100, rotation: 0 });
                setSelectedId('image');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddText = () => {
        setCustomText({ text: 'Saját szöveg', x: 120, y: 200, fontSize: 30, fill: '#000000', rotation: 0 });
        setSelectedId('text');
    };

    // JAVÍTÁS: Most már a póló képe is "üres kattintásnak" számít!
    const checkDeselect = (e) => {
        const clickedOnEmpty = 
            e.target === e.target.getStage() || 
            e.target.attrs.id === 'canvas-bg' ||
            e.target.attrs.name === 'tshirt-base'; // Ha a pólóra kattintanak

        if (clickedOnEmpty) {
            setSelectedId(null);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) { alert("Kérlek válassz méretet!"); return; }
        if (!designImage && !customText) { alert("Kérlek tölts fel egy mintát vagy írj egy szöveget!"); return; }

        setSelectedId(null); 

        setTimeout(() => {
            const finalMergedImage = stageRef.current.toDataURL({ pixelRatio: 2 });
            const customProduct = {
                id: 'custom-' + Date.now(),
                name: 'Egyedi Tervezésű Póló',
                price: 15000,
                images: [finalMergedImage],
                mainImage: finalMergedImage
            };
            addToCart(customProduct, selectedSize, 1);
            alert("Sikeresen kosárba tetted az egyedi pólódat!");
        }, 100);
    };

    const colors = ['#ffffff', '#000000', '#ff0000', '#0000ff', '#1ab60c', '#ffdd00'];

    return (
        <section className="designer-container" style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' }}>Pólótervező</h1>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                
                {/* --- BAL OLDAL: A CANAS RAJZVÁSZON --- */}
                <div style={{ width: '400px', height: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                    <Stage width={400} height={500} onMouseDown={checkDeselect} onTouchStart={checkDeselect} ref={stageRef}>
                        <Layer>
                            {/* Háttér a Canvas-nak */}
                            <Rect id="canvas-bg" width={400} height={500} fill="#f9f9f9" onClick={checkDeselect} />

                            {/* 1. Maga a színezett póló */}
                            <TshirtBase color={tshirtColor} />

                            {/* 2. Minta és szöveg */}
                            <Group>
                                {designImage && (
                                    <DraggableImage shapeProps={designImage} isSelected={selectedId === 'image'} onSelect={() => setSelectedId('image')} onChange={setDesignImage} />
                                )}
                                {customText && (
                                    <DraggableText shapeProps={customText} isSelected={selectedId === 'text'} onSelect={() => setSelectedId('text')} onChange={setCustomText} />
                                )}
                            </Group>

                            {/* 3. A Póló Árnyékai a minta fölé */}
                            <TshirtMask />
                        </Layer>
                    </Stage>
                </div>

                {/* --- JOBB OLDAL: VEZÉRLŐK --- */}
                <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* Színválasztó */}
                    <div className="form-group-block" style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '10px' }}>1. Póló színe</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {colors.map(color => (
                                <div 
                                    key={color} 
                                    onClick={() => setTshirtColor(color)}
                                    style={{ 
                                        width: '40px', height: '40px', borderRadius: '50%', backgroundColor: color, 
                                        cursor: 'pointer', border: tshirtColor === color ? '3px solid #333' : '1px solid #ccc',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Minta feltöltése */}
                    <div className="form-group-block" style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '10px' }}>2. Kép feltöltése</h3>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }} />
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Kattints a mintára a pólón a méretezéshez és forgatáshoz!</p>
                    </div>

                    {/* Szöveg hozzáadása */}
                    <div className="form-group-block" style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '10px' }}>3. Egyedi felirat</h3>
                        {customText ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    value={customText.text} 
                                    onChange={(e) => setCustomText({...customText, text: e.target.value})}
                                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd' }}
                                />
                                <input 
                                    type="color" 
                                    value={customText.fill} 
                                    onChange={(e) => setCustomText({...customText, fill: e.target.value})}
                                    style={{ height: '40px', width: '50px', cursor: 'pointer', padding: '0', border: 'none' }}
                                />
                                <button onClick={() => setCustomText(null)} style={{ background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer', padding: '0 10px' }}>X</button>
                            </div>
                        ) : (
                            <button onClick={handleAddText} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>+ Új szöveg hozzáadása</button>
                        )}
                    </div>

                    {/* Méret és Kosárba */}
                    <div style={{ background: '#fcfcfc', padding: '20px', borderRadius: '10px', border: '1px solid #eee', marginTop: 'auto' }}>
                        <select className="size-select" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', fontSize: '16px' }}>
                            <option value="">Válassz méretet...</option>
                            <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
                        </select>
                        <h2 style={{ marginBottom: '15px' }}>15 000 Ft</h2>
                        <button onClick={handleAddToCart} style={{ width: '100%', background: '#1ab60c', color: 'white', padding: '15px', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            KOSÁRBA RAKOM
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}