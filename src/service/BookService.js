import axios from "axios";

export const getAllBooks = async (name, categoryId) => {
    try {
        let query = "http://localhost:3001/books?";
        if (name) query += `name_like=${name}&`;
        if (categoryId) query += `category_id=${categoryId}&`;
        query = query.slice(0, -1); // Remove the last '&' if it exists

        const res = await axios.get(query);
        return res.data;
    } catch (e) {
        console.error("Error fetching books:", e);
        return [];
    }
};

export const getAllCategories = async () => {
    try {
        const res = await axios.get("http://localhost:3001/categories");
        return res.data;
    } catch (e) {
        console.error("Error fetching categories:", e);
        return [];
    }
};

export const saveOneBook = async (book) => {
    try {
        await axios.post("http://localhost:3001/books", book);
        return true;
    } catch (e) {
        console.error("Error saving product:", e);
        return false;
    }
};
