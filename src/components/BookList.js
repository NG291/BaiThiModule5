import { useEffect, useState } from "react";
import { getAllBooks, getAllCategories } from "../service/BookService";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function BookList() {
    const [books, setBooks] = useState([]);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const categoryRes = await getAllCategories();
            setCategories(categoryRes || []);
            await getAllData(name, categoryId);
        };
        fetchData();
    }, [name, categoryId]);

    const getAllData = async (name, categoryId) => {
        let bookRes = await getAllBooks();
        if (name) {
            bookRes = bookRes.filter(book =>
                book.name.toLowerCase().includes(name.toLowerCase())
            );
        }
        if (categoryId) {
            bookRes = bookRes.filter(book =>
                book.categoryId === categoryId
            );
        }

        const categoryRes = await getAllCategories();
        const combineData = bookRes.map(book => {
            const category = categoryRes.find(c => c.categoryId === book.categoryId);
            return {
                ...book,
                categoryName: category ? category.categoryName : "Khong xac dinh"
            };
        });

        combineData.sort((a, b) => a.quantity - b.quantity);

        setBooks(combineData);
        setNoResults(combineData.length === 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="container mt-4">
            <h2 className="d-flex mb-3">Danh Sach Book</h2>
            <div className="d-flex mb-3">
                <div className="d-flex flex-grow-1 align-items-center me-2">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Nhap ten book"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select className="form-control me-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Chọn thể loại</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary ms-2" onClick={() => getAllData(name, categoryId)}>Tìm kiếm</button>
                <Link to="/create" className="btn btn-primary ms-2">Thêm mới</Link>
            </div>
            {noResults ? (
                <div className="alert alert-warning" role="alert">
                    Không có thông tin của sách này
                </div>
            ) : (
                <table className="table table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Ma Sach</th>
                        <th scope="col">Ten Sach</th>
                        <th scope="col">The loai</th>
                        <th scope="col">Ngay Nhap</th>
                        <th scope="col">So luong</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((item, index) => (
                        <tr key={item.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.bookCode}</td>
                            <td>{item.name}</td>
                            <td>{item.categoryName}</td>
                            <td>{formatDate(item.dateOfAcquisition)}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default BookList;
