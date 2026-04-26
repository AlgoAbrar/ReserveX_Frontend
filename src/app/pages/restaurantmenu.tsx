import React, { useState, useMemo } from "react";

// ================= TYPES =================
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

type Category =
  | "all"
  | "appetizers"
  | "mains"
  | "desserts"
  | "drinks"
  | "specials";

// ================= MOCK DATA =================
const menuData: MenuItem[] = [
  {
    id: "1",
    name: "Chicken Burger",
    description: "Juicy grilled chicken burger with cheese",
    price: 5.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
  },
  {
    id: "2",
    name: "Veg Pizza",
    description: "Fresh vegetables with mozzarella cheese",
    price: 7.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
  },
  {
    id: "3",
    name: "French Fries",
    description: "Crispy golden fries",
    price: 2.99,
    category: "appetizers",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
    isVegetarian: true,
    isSpicy: false,
    isPopular: false,
  },
];

// ================= COMPONENT =================
const RestaurantMenu: React.FC = () => {
  const [category, setCategory] = useState<Category>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  // ================= FILTER =================
  const filteredMenu = useMemo(() => {
    return menuData.filter((item) => {
      const matchCategory =
        category === "all" || item.category === category;

      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [category, search]);

  // ================= CART =================
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);

      if (exists) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ================= UI =================
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🍽️ ReserveX Restaurant Menu</h1>

      {/* SEARCH */}
      <input
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      {/* CATEGORY */}
      <div style={{ marginBottom: 15 }}>
        {["all", "appetizers", "mains", "desserts", "drinks"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c as Category)}
            style={{
              marginRight: 5,
              padding: 8,
              background: category === c ? "#4f46e5" : "#eee",
              color: category === c ? "white" : "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* MENU ITEMS */}
      <div>
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              marginBottom: 10,
              padding: 10,
              borderRadius: 8,
            }}
          >
            <h3>
              {item.name} {item.isPopular && "🔥"}
            </h3>
            <p>{item.description}</p>
            <p>💰 ${item.price}</p>

            <button
              onClick={() => addToCart(item)}
              style={{
                background: "#22c55e",
                color: "white",
                padding: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div style={{ marginTop: 20 }}>
        <h2>🛒 Cart ({cart.length})</h2>

        {cart.map((item) => (
          <p key={item.id}>
            {item.name} x {item.quantity} = $
            {item.price * item.quantity}
          </p>
        ))}

        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default RestaurantMenu;