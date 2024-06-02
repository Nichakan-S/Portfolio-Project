import React, { Component } from 'react';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

class SearchInputAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    };
  }

  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value });
    // ส่งออบเจกต์ event กลับไปยัง prop onChange แทนที่จะเป็นเพียง e.target.value
    if (this.props.onChange) {
      this.props.onChange(e); // แก้ไขที่นี่
    }
  }

  render() {
    return (
      <Input
        className="flex-grow mx-4 p-1 text-base border rounded-xl custom-input"
        placeholder={this.props.placeholder || "ค้นหาคณะ..."}
        type="text"
        value={this.state.searchTerm}
        onChange={this.handleChange}
        style={{ fontSize: '16px', width: '50%', flex: 'none' }}
        suffix={<FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4b70af" }} className="mr-4" />}
      />
    );
  }
}

export default SearchInputAll;
