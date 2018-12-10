const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes');
const authRouter = require('./routes/auth')
const sequelize = require('./models').sequelize;

const app = express();
sequelize.sync();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');
app.set('port', process.env.PORT || 5000);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser('boostrun'));
app.use(session({
    resave: false,
    saveUninitialized : false,
    secret : 'boostrun',
    cookie : {
        httpOnly : true,
        secure : false,
    }
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// 해당 라우터가 없을시 404 Error 발생
app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 에러 핸들러
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render(error);
});

app.listen(app.get('port'), ()=> {
    console.log(app.get('port'), '번 포트에서 대기 중');
});