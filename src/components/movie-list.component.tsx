import React, { Fragment } from 'react';
// models
import IMovieItem from '../models/movie-item.interface';
import IGenreItem from '../models/genre-item.interface';
// libs
import { cloneDeep } from 'lodash';

const styles = require('./movie-list.css');

interface IState {
	data: any;
	imageUrl: string;
	imageSizes: Array<string>;
	genreList: Array<IGenreItem>;
	movieListItems: any;
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
			movieListItems: null
    };
	}

	componentDidMount() {
		console.log(this.state.data);
		this.sortListByPopularity();
	}

	sortListByPopularity = () => {
		let newMovieData = cloneDeep(this.state.data);
		// newMovieData.results[0].popularity = 1;
		// console.log(newMovieData);

		newMovieData.results.sort((a: IMovieItem, b: IMovieItem) => {
			// console.log(a.popularity, b.popularity);
			return a.popularity - b.popularity;
		});

		this.setState({data: newMovieData});
		this.renderMovieList();

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
