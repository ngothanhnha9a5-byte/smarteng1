import React, { useState } from "react";
import { UserProfile } from "../types";
import { buyItem, equipItem } from "../services/db";
import { motion } from "motion/react";
import { Coins, ShoppingBag, Check, Sparkles, User, Shield } from "lucide-react";

interface ShopProps {
  user: UserProfile;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: "avatar" | "character";
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "avatar_1",
    name: "Cyber Punk",
    price: 500,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk",
    type: "avatar"
  },
  {
    id: "avatar_2",
    name: "Astro Cat",
    price: 800,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=astrocat",
    type: "avatar"
  },
  {
    id: "avatar_3",
    name: "Golden King",
    price: 1500,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=goldenking",
    type: "avatar"
  },
  {
    id: "avatar_4",
    name: "Neon Ninja",
    price: 1200,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ninja",
    type: "avatar"
  },
  {
    id: "avatar_5",
    name: "Space Explorer",
    price: 2000,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=space",
    type: "avatar"
  },
  {
    id: "avatar_6",
    name: "Dragon Master",
    price: 3000,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=dragon",
    type: "avatar"
  },
  {
    id: "avatar_7",
    name: "Tech Wizard",
    price: 2500,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=wizard",
    type: "avatar"
  },
  {
    id: "avatar_8",
    name: "Nature Guardian",
    price: 1000,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=nature",
    type: "avatar"
  },
  {
    id: "avatar_9",
    name: "Future Pilot",
    price: 1800,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=pilot",
    type: "avatar"
  },
  {
    id: "char_1",
    name: "Samurai Jack",
    price: 5000,
    image: "https://api.dicebear.com/7.x/bottts/svg?seed=jack",
    type: "character"
  },
  {
    id: "char_2",
    name: "Robo Cop",
    price: 4500,
    image: "https://api.dicebear.com/7.x/bottts/svg?seed=cop",
    type: "character"
  },
  {
    id: "char_3",
    name: "Iron Knight",
    price: 6000,
    image: "https://api.dicebear.com/7.x/bottts/svg?seed=knight",
    type: "character"
  }
];

export default function Shop({ user }: ShopProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleBuy = async (item: ShopItem) => {
    setLoading(item.id);
    setMessage(null);
    const success = await buyItem(user.uid, item.id, item.price);
    if (success) {
      setMessage({ text: `Đã mua thành công ${item.name}!`, type: "success" });
    } else {
      setMessage({ text: "Không đủ coins hoặc bạn đã sở hữu vật phẩm này.", type: "error" });
    }
    setLoading(null);
  };

  const handleEquip = async (item: ShopItem) => {
    setLoading(item.id);
    await equipItem(user.uid, item.image);
    setMessage({ text: `Đã trang bị ${item.name}!`, type: "success" });
    setLoading(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <ShoppingBag className="text-indigo-600" size={36} /> Cửa hàng Vật phẩm
          </h2>
          <p className="text-slate-500">Dùng Coins bạn kiếm được để nâng cấp ngoại hình!</p>
        </div>
        
        <div className="bg-white px-8 py-4 rounded-[32px] border border-slate-100 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
            <Coins size={28} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Số dư hiện tại</p>
            <p className="text-2xl font-black text-slate-900">{user.coins.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 rounded-2xl text-center font-bold ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SHOP_ITEMS.map((item, idx) => {
          const isOwned = user.inventory.includes(item.id);
          const isEquipped = user.photoURL === item.image;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.type === 'avatar' ? 'p-8' : ''}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.type === 'avatar' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {item.type === 'avatar' ? 'Avatar' : 'Nhân vật'}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between mt-6">
                  {!isOwned ? (
                    <div className="flex items-center gap-2 text-amber-600 font-black">
                      <Coins size={18} />
                      <span>{item.price.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <Check size={18} />
                      <span>Đã sở hữu</span>
                    </div>
                  )}

                  {isOwned ? (
                    <button
                      onClick={() => handleEquip(item)}
                      disabled={isEquipped || loading === item.id}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${
                        isEquipped 
                          ? "bg-slate-100 text-slate-400 cursor-default" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                      }`}
                    >
                      {isEquipped ? "Đang dùng" : "Trang bị"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={loading === item.id || user.coins < item.price}
                      className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading === item.id ? "Đang mua..." : "Mua ngay"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 p-10 bg-slate-900 rounded-[40px] text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Sparkles className="text-amber-400" /> Thẻ Thành Viên VIP
            </h3>
            <p className="text-slate-400">Sắp ra mắt! Nhận x2 Coins và các vật phẩm độc quyền.</p>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all whitespace-nowrap">
            Tìm hiểu thêm
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      </div>
    </div>
  );
}
