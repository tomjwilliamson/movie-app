import React, { Fragment } from 'react';
// models
import IMovieItem from '../../models/movie-item.interface';
import IGenreItem from '../../models/genre-item.interface';
// libs
import { cloneDeep } from 'lodash';

const styles = require('./genre-filters.css');

interface IState {
	data: Array<IGenreItem>;
	filterListItems: any;
	selectedFilters: Array<any>;
}

interface IProps {
	genreList: Array<IGenreItem>;
	submitNewFilters: any;
}

class GenreFiltersComponent extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
			data: props.genreList,
			filterListItems: null,
			selectedFilters: []
    };
	}

	componentDidMount() {
		console.log(this.state.data);
		this.renderGenreItems();
	}

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		if (prevState.selectedFilters.length !== this.state.selectedFilters.length) {
			this.props.submitNewFilters(this.state.selectedFilters);
		}
	}

	handleChange = (id: number) => {
		const newFilterSelectedArr = [...this.state.selectedFilters];
		newFilterSelectedArr.push(id);
		this.setState({selectedFilters: newFilterSelectedArr});
	}

	renderGenreItems = () => {
    const holder = this.state.data.map((i: IGenreItem, index: number) => {
			return <div key={index + 'cb'}><input type='checkbox' name='checkbox' id={'checkbox_id' + index} value={i.id} onChange={(e) => this.handleChange(i.id)}/><label htmlFor={'checkbox_id' + index}>{i.name}</label></div>
		});
		this.setState({filterListItems: holder});
	};

  public render() {

    return (
      <Fragment>
				<div className='filter-items'>
					{this.state.filterListItems}
				</div>
      </Fragment>
    );

  };

};

export default GenreFiltersComponent;
