import {
    useEffect,
    useState
}

    from "react";

import {
    FaEdit,
    FaPlus,
    FaTrash,
    FaTimes,
}

    from "react-icons/fa";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

import {
    apiDelete,
    apiGet,
    apiPost,
    apiPut,
}

    from "../../Services/api";

import "./AdminCategoriesPage.css";

type Category = {
    id: number;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    parentCategoryId?: number | null;
    parentCategoryName?: string | null;
}

    ;

function AdminCategoriesPage() {
    const [categories,
        setCategories] = useState<Category[]>([]);

    const [name,
        setName] = useState("");
    const [description,
        setDescription] = useState("");
    const [imageUrl,
        setImageUrl] = useState("");
    const [parentCategoryId,
        setParentCategoryId] = useState("");

    const [editingId,
        setEditingId] = useState<number | null>(null);

    const [loading,
        setLoading] = useState(true);
    const [saving,
        setSaving] = useState(false);
    const [error,
        setError] = useState("");

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiGet<Category[]>("/categories"
            );

            setCategories(data);
        }

        catch (error) {
            setError(error instanceof Error ? error.message : "Could not load categories."
            );
        }

        finally {
            setLoading(false);
        }
    }

        ;

    useEffect(() => {
        loadCategories();
    }

        , []);

    const resetForm = () => {
        setName("");
        setDescription("");
        setImageUrl("");
        setParentCategoryId("");
        setEditingId(null);
    }

        ;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const data = {
                name,
                description: description || null,
                imageUrl: imageUrl || null,
                parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null,
            }

                ;

            if (editingId !== null) {
                await apiPut(`/categories/${editingId}`,
                    data,
                    true);
            }

            else {
                await apiPost("/categories",
                    data,
                    true);
            }

            resetForm();
            await loadCategories();

        }

        catch (error) {
            setError(error instanceof Error ? error.message : "Could not save category."
            );
        }

        finally {
            setSaving(false);
        }
    }

        ;

    const handleEdit = (category: Category) => {
        setEditingId(category.id);

        setName(category.name);
        setDescription(category.description ?? "");
        setImageUrl(category.imageUrl ?? "");

        setParentCategoryId(category.parentCategoryId?.toString() ?? ""
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

        ;

    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${category.name}" ?`);

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await apiDelete(`/categories/${category.id}`,
                true);

            setCategories((current) => current.filter((item) => item.id !== category.id));

            if (editingId === category.id) {
                resetForm();
            }

        }

        catch (error) {
            setError(error instanceof Error ? error.message : "Could not delete category."
            );
        }
    }

        ;

    return (<> <Navbar /> <main className="admin-categories" > <div className="admin-categories-container" > <div className="categories-header" > <div> <span>Administration</span> <h1>Categories</h1> <p> Create and manage product categories. </p> </div> </div> <form className="category-form"

        onSubmit={
            handleSubmit
        }

    > <div className="category-form-title" > <h2> {
        editingId !== null ? "Edit Category"
            : "Add Category"
    }

    </h2> {
                editingId !== null && (<button type="button"

                    onClick={
                        resetForm
                    }

                    className="cancel-edit-btn"
                > <FaTimes /> Cancel Edit </button>)
            }

        </div> <div className="category-form-grid" > <div className="category-field" > <label>Name</label> <input type="text"

            value={
                name
            }

            onChange={
                (e) => setName(e.target.value)
            }

            required /> </div> <div className="category-field" > <label>Parent Category</label> <select value={
                parentCategoryId
            }

                onChange={
                    (e) => setParentCategoryId(e.target.value)
                }

            > <option value="" > No Parent </option> {
                    categories.filter((category) => category.id !== editingId).map((category) => (<option key={
                        category.id
                    }

                        value={
                            category.id
                        }

                    > {
                            category.name
                        }

                    </option>))
                }

            </select> </div> <div className="category-field category-full" > <label>Description</label>
                <textarea rows={
                3
            }

                value={
                    description
                }

                onChange={
                    (e) => setDescription(e.target.value)
                }

            /> </div> <div className="category-field category-full" > <label>Image URL</label> <input type="url"
                value={
                    imageUrl
                }

                onChange={
                    (e) => setImageUrl(e.target.value
                    )
                }

                placeholder="https://..."

            /></div></div> {
            error && (<p className="category-error" > {
                error
            }

            </p>)
        }

        <button type="submit"
            className="save-category-btn"

            disabled={
                saving
            }

        ><FaPlus /> {
                saving ? "Saving..."
                    : editingId !== null ? "Save Changes"
                        : "Add Category"
            }

        </button></form><div className="categories-table-card"> {
            loading ? (<p className="categories-message" > Loading categories... </p>) : categories.length === 0 ? (<p className="categories-message" > No categories found. </p>) : (<div className="categories-table-wrapper" > <table className="categories-table" > <thead> <tr> <th>Category</th> <th>Parent</th> <th>Description</th> <th>Actions</th> </tr> </thead> <tbody> {
                categories.map((category) => (<tr key={
                    category.id
                }

                > <td> <div className="category-info" > {
                    category.imageUrl && (<img src={
                        category.imageUrl
                    }

                        alt={
                            category.name
                        }

                    />)
                }

                    <strong> {
                        category.name
                    }

                    </strong> </div> </td> <td> {
                        category.parentCategoryName ?? "—"
                    }

                    </td> <td> {
                        category.description ?? "—"
                    }

                    </td> <td> <div className="category-actions" > <button type="button"
                        className="category-edit-btn"

                        onClick={
                            () => handleEdit(category)
                        }

                        title="Edit"
                    > <FaEdit /> </button> <button type="button"
                        className="category-delete-btn"

                        onClick={
                            () => handleDelete(category)
                        }

                        title="Delete"
                    > <FaTrash /> </button> </div> </td> </tr>))
            }

            </tbody> </table> </div>)
        }

        </div></div></main><Footer /></>);
}

export default AdminCategoriesPage;