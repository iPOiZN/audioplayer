// import webpack from "webpack-stream";
import minify from "gulp-minify";

export const js = () => {
  return (
    app.gulp
      .src(app.path.src.js, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>s",
          })
        )
      )
      // .pipe(
      //   webpack({
      //     mode: app.isBuild ? 'production' : 'development',
      //     output: {
      //       filename: "app.min.js",
      //     },
      //   })
      // )
      .pipe(
        minify({
          ext: {
            src: false,
            min: ".min.js",
          },
          noSource: true,
        })
      )
      // .pipe(webpack({ mode: "none", output: { filename: "app.min.js" } }))
      .pipe(app.gulp.dest(app.path.build.js))
      .pipe(app.plugins.browsersync.stream())
  );
};
