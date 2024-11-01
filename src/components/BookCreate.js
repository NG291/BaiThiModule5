import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {getAllCategories, saveOneBook} from "../service/BookService"; // Giả sử bạn có một service bookService để xử lý API

function BookCreate() {
    const [form, setForm] = useState({
        bookCode: "",
        name: "",
        categoryId: "",
        dateOfAcquisition: "",
        quantity: 0
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response);
            } catch (error) {
                toast.error("Không thể tải thể loại sách");
            }
        };

        fetchCategories();
    }, []);

    const validationSchema = Yup.object({
        bookCode: Yup.string()
            .matches(/^BO-\d{4}$/, "Mã sách phải đúng định dạng BO-XXXX")
            .required("Mã sách là bắt buộc"),
        name: Yup.string()
            .max(100,"Tên nhập vào không dài quá 100 kí tự")
            .required("Tên sách là bắt buộc"),
        categoryId: Yup.string()
            .required("Thể loại sách là bắt buộc"),
        dateOfAcquisition: Yup.date()
            .max(new Date(), "Ngày nhập sách không được lớn hơn ngày hiện tại")
            .required("Ngày nhập sách là bắt buộc"),
        quantity: Yup.number()
            .integer("Số lượng phải là số nguyên")
            .positive("Số lượng phải lớn hơn 0")
            .required("Số lượng sách là bắt buộc")
    });

    const saveBook = async (value) => {
        value.quantity = +value.quantity;
        const isSuccess = await saveOneBook(value);
        if (isSuccess) {
            toast.success("Thêm mới sách thành công");
            navigate("/books");
        } else {
            toast.error("Thêm mới sách thất bại");
        }
    }

    const handleCancel = () => {
        navigate("/");
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2>Thêm Sách Mới</h2>
                    <Formik
                        initialValues={form}
                        onSubmit={saveBook}
                        validationSchema={validationSchema}
                    >
                        <Form>
                            <div className="form-group mb-3">
                                <label htmlFor="bookCode">Mã Sách:</label>
                                <Field name="bookCode" type="text" className="form-control"/>
                                <ErrorMessage name="bookCode" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="name">Tên Sách:</label>
                                <Field name="name" type="text" className="form-control"/>
                                <ErrorMessage name="name" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="categoryId">Thể Loại:</label>
                                <Field as="select" name="categoryId" className="form-control">
                                    <option value="">Chọn Thể Loại</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="categoryId" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="dateOfAcquisition">Ngày Nhập Sách:</label>
                                <Field name="dateOfAcquisition" type="date" className="form-control"/>
                                <ErrorMessage name="dateOfAcquisition" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="quantity">Số Lượng:</label>
                                <Field name="quantity" type="number" className="form-control"/>
                                <ErrorMessage name="quantity" component="p" className="text-danger"/>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">Thêm Mới</button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Hủy</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default BookCreate;
