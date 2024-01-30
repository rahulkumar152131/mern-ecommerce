import React, { useEffect, useState } from 'react'
import Slider from 'rc-slider';
import Select from 'react-select';
import "./style.scss";
import 'rc-slider/assets/index.css';
import { useDispatch } from 'react-redux';
import { filterProductsAsync } from '../../../redux/reducer/productsReducer';
const Filter = () => {
    const [range, setRange] = useState([0, 5000]);
    const [category, setCategory] = useState([]);

    const categoryOptions = [
        { value: 'electronics', label: 'Electronics' },
        { value: 'shirt', label: 'Shirt' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'jewellery', label: 'Jewellery' },
        { value: 'men-s-wear', label: "Men's Wear" },
        { value: 'women-s-wear', label: "Women's Wear" },
    ];
    // console.log(category);
    const dispatch = useDispatch();
    // const handleChecked = (e) => {
    //     if (e.target.checked) {
    //         setCategory([...category, e.target.value]);
    //     } else {
    //         setCategory(category.filter((cat) => cat !== e.target.value))
    //     }
    // }
    const handleCategoryChange = (selectedOptions) => {
        selectedOptions = selectedOptions.map((option) => {
            return option.value;
        })
        setCategory(selectedOptions);
    };
    useEffect(() => {
        dispatch(filterProductsAsync({ minPrice: range[0], maxPrice: range[1], category }))
    }, [dispatch, range, category])
    return (
        <div className='filter-container'>
            <div className="range">
                <label>{range[0]}</label>
                <Slider className='range-input'
                    min={0}
                    max={5000}
                    range
                    defaultValue={range}
                    onChange={(newRange) => setRange(newRange)}
                />
                <label> {range[1]}</label>
            </div>
            <div className="category-filter">
                <Select
                    defaultValue={category}
                    onChange={handleCategoryChange}
                    options={categoryOptions}
                    className="category-select"
                    classNamePrefix="category-select-prefix"
                    placeholder="Select to Filter"
                    isMulti
                    isClearable
                    isSearchable={false}
                />
            </div>
        </div>
    )
}

export default Filter