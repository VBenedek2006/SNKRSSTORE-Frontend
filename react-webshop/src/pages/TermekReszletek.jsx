import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as backupProducts } from '../products';
import { CartContext } from '../CartContext';

export default function TermekReszletek() {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const [shoe, setShoe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch('http://localhost:5074/api/Products');
                if (!response.ok) throw new Error("Hiba a szerver elérésekor");
                
                const dbData = await response.json();
                
                // C# id/Id keresés
                const foundDbShoe = dbData.find(p => p.id === parseInt(id) || p.Id === parseInt(id));
                
                if (foundDbShoe) {
                    // --- HIBRID TRÜKK: Összekötjük a DB cipőt a helyi képekkel/méretekkel ---
                    const dbId = foundDbShoe.id || foundDbShoe.Id;
                    const localItem = backupProducts.find(p => p.id === dbId);
                    
                    const mergedShoe = {
                        ...foundDbShoe,
                        id: dbId, // Szabványosítjuk
                        // Betöltjük a helyi képeket, vagy adunk egy alapértelmezettet
                        images: localItem && localItem.images ? localItem.images : ['/img/placeholder.webp'],
                        // Betöltjük a helyi méreteket, vagy adunk egy alapértelmezettet
                        sizes: localItem && localItem.sizes ? localItem.sizes : ['40', '41', '42', '43', '44']
                    };

                    setShoe(mergedShoe);
                    // A főképet az images tömb első elemére állítjuk
                    setMainImage(mergedShoe.images[0]);
                } else {
                    fallbackToLocal();
                }
            } catch (error) {
                fallbackToLocal();
            } finally {
                setLoading(false);
            }
        };

        const fallbackToLocal = () => {
            const backupShoe = backupProducts.find(p => p.id === parseInt(id));
            setShoe(backupShoe);
            if (backupShoe) {
                setMainImage(backupShoe.images ? backupShoe.images[0] : '/img/placeholder.webp');
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div style={{textAlign: "center", padding: "100px"}}><h2>Betöltés...</h2></div>;
    if (!shoe) return <div style={{textAlign: "center", padding: "100px"}}><h2>A termék nem található!</h2><Link to="/webshop">Vissza a webshopba</Link></div>;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Kérlek, válassz méretet mielőtt a kosárba teszed!");
            return;
        }
        addToCart(shoe, selectedSize, parseInt(quantity));
    };

    // Mivel a Hibrid trükk garantálja, hogy ezek rendben vannak, itt már nincs szükség bonyolult ellenőrzésekre:
    const displayImages = shoe.images;
    const displaySizes = shoe.sizes;

    return (
        <section className="single-product-container">
            <div className="product-image-section">
                <img src={mainImage} id="MainImg" alt={shoe.name || shoe.Name} />
                <div className="small-img-group">
                    {displayImages.map((img, index) => (
                        <div className="small-img-col" key={index}>
                            <img 
                              src={img} 
                              className="small-img" 
                              alt={`${shoe.name || shoe.Name} ${index}`} 
                              onClick={() => setMainImage(img)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="product-details-section">
                <h6>{shoe.name || shoe.Name}</h6>
                <h2>{Number(shoe.price || shoe.Price).toLocaleString('hu-HU')} FT</h2>
                
                <select className="size-select" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                    <option value="">Válassz méretet</option>
                    {displaySizes.map((size, index) => (
                        <option value={size} key={index}>{size}</option>
                    ))}
                </select>
                
                <div className="purchase-controls">
                    <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(e.target.value)} />
                    <button className="btn-buy" onClick={handleAddToCart}>Kosárba</button>
                </div>

                <h4>Termékleírás</h4>
                <p>{shoe.description || shoe.Description}</p>
            </div>
        </section>
    );
}