import React, { Component, Fragment } from 'react';
import axios from 'axios';
// components
import MovieListComponent from './components/movie-list/movie-list.component';
import GenreFiltersComponent from './components/genre-filters/genre-filters.component';
// models
import IMovieItem from './models/movie-item.interface';
import IGenreItem from './models/genre-item.interface';
// api paths
import { API_PATH, GET_MOVIES, GET_GENERES, GET_CONFIG } from './globals';
// libs
import { cloneDeep } from 'lodash';

interface IState {
  movieData: any;
  baseUrl: string;
  imagesSizes: Array<string>;
  genreList: Array<IGenreItem>;
  genreStringsCreated: boolean;
  selectedFilters: Array<number>;
  key: string;
  dataLoaded: boolean;
}

enum GetDataType {
  movie = 0,
  config = 1,
  genres = 2
}

class App extends React.Component<any, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      movieData: null,
      baseUrl: '',
      imagesSizes: [],
      genreList: [],
      genreStringsCreated: false,
      key: 'e6b4ece6ed304578d02498d86fdd2c16',
      selectedFilters: [],
      dataLoaded: false
    }
  }

  componentDidMount() {
    // get config for image paths
    this.getData(API_PATH + GET_CONFIG, GetDataType[1]);
    // get movie gernes
    this.getData(API_PATH + GET_GENERES, GetDataType[2]);
    // get inital movie list data
    this.getData(API_PATH + GET_MOVIES, GetDataType[0]);
  }

  componentDidUpdate(prevProps: any, prevState: IState) {
    if (this.state.movieData !== null && this.state.genreList.length > 0 && !this.state.genreStringsCreated) {
      this.createGenreStrings();
    }

    if (this.state.movieData !== null && this.state.genreList.length > 0 && this.state.baseUrl !== '' && this.state.imagesSizes.length > 0 && this.state.genreStringsCreated && !this.state.dataLoaded) {
      this.setState({dataLoaded: true});
    }

    if (prevState.selectedFilters.length !== this.state.selectedFilters.length) {
      this.filterMovieListByGenre();
    }

  }

  getData(path: string, type: string) {
    axios({
      method: 'get',
      url: path + '?api_key=' + this.state.key
    })
    .then((response) => {
      if (type === 'config') {
        this.setState({
          baseUrl: response.data.images.base_url,
          imagesSizes: response.data.images.poster_sizes
        });
      } else if(type === 'genres') {
        this.setState({genreList: response.data.genres});
      }
      else if (type === 'movie') {
        this.setState({movieData: response.data});
      }
      
    })
    .catch((error) => {
      console.log('err', error);
    });
  }

  createGenreStrings = () => {
    // generate genre string based on the id form the item results
    // use lodash to clone the state items - stop mutate of state 
    // loop throught cloned data, loop throught id array
    // then match id from genre array and create string from name values
    let newMovieData = cloneDeep(this.state.movieData);
    newMovieData.results.map((i: IMovieItem, index: number) => {
      let strArr: any = [];
      for (const id of i.genre_ids) { this.state.genreList.map((x: any) => { if (x.id === id) { strArr.push(x.name);}}); }
      i.genre_string = strArr.length > 0 ? strArr.join(', ') : '';
    });
    this.setState({
      movieData: newMovieData,
      genreStringsCreated: true
    });
  }

  filterMovieListByGenre = () => {
    let newMovieData = cloneDeep(this.state.movieData);
    const filteredData: any = [];

    newMovieData.results.map((i: IMovieItem) => {
      i.genre_ids.filter(x => {
        console.log(this.state.selectedFilters.includes(x));
        if (this.state.selectedFilters.includes(x)) {
          filteredData.push(i);
        }
      });
    });

    console.log(filteredData);

    console.log(newMovieData);

  }
  
  handleFilterChange = (filters: Array<number>) => {
    console.log(filters);
    this.setState({selectedFilters: filters});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Movie list</h1>
        </header>
        {this.state.dataLoaded ?
          <Fragment>
            <GenreFiltersComponent genreList={this.state.genreList} submitNewFilters={(e: any) => this.handleFilterChange(e)}></GenreFiltersComponent>
            <MovieListComponent data={this.state.movieData} imageUrl={this.state.baseUrl} imageSizes={this.state.imagesSizes} genreList={this.state.genreList}></MovieListComponent>
          </Fragment>
          : <p>Loading</p>
        }
      </div>
    );
  }
}

export default App;
