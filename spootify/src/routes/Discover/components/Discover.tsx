import React, { Component } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import { Buffer } from "buffer";

//TODO: Fix `any` types here

interface IDiscoverProps {}

interface IDiscoverState {
  newReleases: Array<object>;
  playlists: Array<object>;
  categories: Array<object>;
}

export default class Discover extends Component<
  IDiscoverProps,
  IDiscoverState
> {
  constructor(props: IDiscoverProps) {
    super(props);

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
    };
  }

  //TODO: Handle APIs

  componentDidMount() {
    //We need to get a bearer token using /api/token service from Spotify
    //From line 36 to 57 we are supposed to get it according to the documentation

    const env = process.env;
    const client_id = env.REACT_APP_SPOTIFY_CLIENT_ID;
    const client_secret = env.REACT_APP_SPOTIFY_CLIENT_SECRET;
    const auth = Buffer.from(client_id + ":" + client_secret).toString(
      "base64"
    );
    var token;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic " + auth);

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        grant_type: "client_credentials",
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        token = result.access_token;
      });

    //I get 415 error, so I injected the token I got from the developer.spotify.com website
    //So that I could successfully bring the data into the UI

    token =
      "BQAekR9vnW8bk-eCMLt_YfEMwyWeGmz0MRzxiM0tgoxiG29C6UqN-R_YgIg5A_qIzMH8mWQifmlvF1l6NV7I5yCXoqDQIEfIZ5i36IVXVkWvKANTSeDfo3fGVhT2NY6EeK6SOHl17i8y0w";

    fetch("https://api.spotify.com/v1/browse/new-releases", {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          newReleases: result.albums.items,
        });
      });

    fetch("https://api.spotify.com/v1/browse/featured-playlists", {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          playlists: result.playlists.items,
        });
      });

    fetch("https://api.spotify.com/v1/browse/categories", {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          categories: result.categories.items,
        });
      });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
        />
      </div>
    );
  }
}
