import React, { Fragment } from 'react';
// models
import IMovieItem from '../../models/movie-item.interface';
import IGenreItem from '../../models/genre-item.interface';
// libs
import { cloneDeep } from 'lodash';

const styles = require('./movie-list.css');

interface IState {
	data: any;
	imageUrl: string;
	imageSizes: Array<string>;
	genreList: Array<IGenreItem>;
	movieListItems: any;
	sortCount: number;
}

interface IProps {
	data: any;
	imageUrl: string;
	imageSizes: Array<string>;
	genreList: Array<IGenreItem>;
}

class MovieListComponent extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
			data: props.data,
			imageUrl: props.imageUrl,
			imageSizes: props.imageSizes,
			genreList: props.genreList,
			movieListItems: null,
			sortCount: 0
    };
	}

	componentDidMount() {
		console.log(this.state.data);
		this.sortListByPopularity();
	}

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		// if the sort count has changed
		if (prevState.sortCount !== this.state.sortCount) {
			// render list
			this.renderMovieList();
		}
	}

	sortListByPopularity = () => {
		// clone the state data before sorting - stop mutate
		let newMovieData = cloneDeep(this.state.data);
		// sort the result set based on popularity
		newMovieData.results.sort((a: IMovieItem, b: IMovieItem) => { return b.popularity - a.popularity; });

		// increment a sortCount value - helps to render the view after the state has updated
		// and stops any loop errors in lifecycle events
		const count = this.state.sortCount + 1;
		this.setState({
			data: newMovieData,
			sortCount: count
		});
	}
	
	renderMovieList = () => {
    const holder = this.state.data.results.map((i: IMovieItem, index: number) => {
			return  <article key={index} className="movie-item">
								<h3>{i.title}</h3>
								<img src={this.state.imageUrl + this.state.imageSizes[2] + i.poster_path} />
								<p>{i.genre_string}</p>
							</article>
		});
    this.setState({movieListItems: holder});
  };

  public render() {

    return (
      <Fragment>
				<div className="flex-grid">
					{this.state.movieListItems}
				</div>
      </Fragment>
    );

  };

};

export default MovieListComponent;
