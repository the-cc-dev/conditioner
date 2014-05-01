define(['lib/conditioner','lib/utils/Observer'],function(conditioner,Observer){

    'use strict';

    describe('API',function() {

        beforeEach(function(){

            // clean up any initialized nodes
            var nodes = conditioner.getNodes(),el;
            nodes.forEach(function(node){
                el = node.getElement();
                conditioner.destroyNode(node);
                el.parentNode.removeChild(el);
            });

        });

        describe('init([options])', function () {

            it('will process elements attached to the DOM', function () {

                // arrange
                var element = document.createElement('div');
                element.setAttribute('data-module', 'mock/modules/foo');
                document.body.appendChild(element);

                // act
                conditioner.init();

                // assert
                expect(element.getAttribute('data-processed')).to.equal('true');

            });

            it('will set options when passing an options object', function () {

                // arrange
                var element = document.createElement('div');
                element.setAttribute('data-module','IFoo');
                document.body.appendChild(element);

                // act
                conditioner.init({
                    'modules': {
                        'mock/modules/foo': {
                            'alias':'IFoo'
                        }
                    }
                });

                // assert
                expect(element.getAttribute('data-processed')).to.equal('true');

            });

        });

        describe('setOptions(options)', function () {

            it('will throw an error when not passed an options object',function(){

                // arrange
                var attemptToSetOptions = function(){conditioner.setOptions()};

                // act, assert
                expect(attemptToSetOptions).to.throw(Error);

            });

            it('will set options when passing an options object', function (done) {

                // arrange
                var element = document.createElement('div');
                element.setAttribute('data-module', 'IFoo');
                document.body.appendChild(element);

                // act
                conditioner.setOptions({
                    'modules': {
                        'mock/modules/foo':{
                            'options':{
                                'foo':10
                            }
                        }
                    }
                });

                var results = conditioner.init();

                // assert
                expect(results).to.be.an('array');

                Observer.subscribe(results[0],'load',function(){

                    expect(element.getAttribute('data-foo')).to.equal('10');

                    done();
                });

            });

            it('will set correct options when passing a module alias', function () {

                // arrange
                var element = document.createElement('div');
                element.setAttribute('data-module', 'IFoo');
                document.body.appendChild(element);

                // act
                conditioner.setOptions({
                    'modules': {
                        'mock/modules/foo': {
                            'alias':'IFoo'
                        }
                    }
                });
                conditioner.init();

                // assert
                expect(element.getAttribute('data-processed')).to.equal('true');

            });

            it('will set correct options when passing a shortcut module alias', function () {

                // arrange
                var element = document.createElement('div');
                element.setAttribute('data-module', 'IFoo');
                document.body.appendChild(element);

                // act
                conditioner.setOptions({
                    'modules': {
                        'mock/modules/foo':'IFoo'
                    }
                });
                conditioner.init();

                // assert
                expect(element.getAttribute('data-processed')).to.equal('true');

            });

        });

        describe('parse(context)',function(){

            it('will throw an error when no context supplied',function(){

                // act, assert
                var attemptToParseNodes = function(){conditioner.parse()};
                expect(attemptToParseNodes).to.throw(Error);

            });

        });

        describe('sync()',function(){

            var a, b, c, group, results;

            beforeEach(function(){

                // arrange
                a = document.createElement('div');
                a.id = 'a';
                a.className = 'alpha';
                a.setAttribute('data-module','mock/modules/foo');

                b = document.createElement('div');
                b.id = 'b';
                b.className = 'beta';
                b.setAttribute('data-module','mock/modules/bar');

                c = document.createElement('div');
                c.id = 'c';
                c.className = 'beta';
                c.setAttribute('data-module','mock/modules/baz');

                group = document.createElement('div');
                group.appendChild(a);
                group.appendChild(b);
                group.appendChild(c);

                // act
                results = conditioner.parse(group);

            });

            it('will throw an error when passing undefined',function(){

                var syncIt = function(){
                    conditioner.sync(results[0],undefined,results[1],results[2]);
                };
                expect(syncIt).to.throw(Error);

            });

            it('will return a sync group object when passing Arguments',function(){

                var syncGroup = conditioner.sync(results[0],results[1],results[2]);
                expect(syncGroup).to.be.an('object');

            });

            it('will return a sync group object when passing Array',function(){

                var syncGroup = conditioner.sync(results);
                expect(syncGroup).to.be.an('object');

            });

        });

        describe('getModule(path,selector,context)',function(){

            var a, b, c, group, results;

            beforeEach(function(){

                // arrange
                a = document.createElement('div');
                a.id = 'a';
                a.className = 'alpha';
                a.setAttribute('data-module','mock/modules/foo');

                b = document.createElement('div');
                b.id = 'b';
                b.className = 'beta';
                b.setAttribute('data-module','mock/modules/bar');

                c = document.createElement('div');
                c.id = 'c';
                c.className = 'beta';
                c.setAttribute('data-module','mock/modules/baz');

                group = document.createElement('div');
                group.appendChild(a);
                group.appendChild(b);
                group.appendChild(c);

                // act
                results = conditioner.parse(group);

            });

            it('will return the first module controller if no path supplied',function(){

                var mc = conditioner.getModule();
                expect(mc.getModulePath()).to.equal(a.getAttribute('data-module'));

            });

            it('will return the first matched module controller when a path is supplied',function(){

                var mc = conditioner.getModule('mock/modules/bar');
                expect(mc.getModulePath()).to.equal(b.getAttribute('data-module'));

            });

            it('will return null if no matches found',function(){

                var mc = conditioner.getModule('mock/modules/trololo');
                expect(mc).to.not.be.defined;

            });

        });

        describe('getModules(path,selector,context)',function(){

            var a, b, c, group, results;

            beforeEach(function(){

                // arrange
                a = document.createElement('div');
                a.id = 'a';
                a.className = 'alpha';
                a.setAttribute('data-module','mock/modules/foo');

                b = document.createElement('div');
                b.id = 'b';
                b.className = 'beta';
                b.setAttribute('data-module','mock/modules/foo');

                c = document.createElement('div');
                c.id = 'c';
                c.className = 'beta';
                c.setAttribute('data-module','mock/modules/baz');

                group = document.createElement('div');
                group.appendChild(a);
                group.appendChild(b);
                group.appendChild(c);

                // act
                results = conditioner.parse(group);

            });

            it('will return all module controllers if no path supplied',function(){

                var mcs = conditioner.getModules();
                expect(mcs.length).to.equal(results.length);

            });

            it('will return the first matched module controller when a path is supplied',function(){

                var mcs = conditioner.getModules('mock/modules/foo','.beta');
                expect(mcs.length).to.equal(1);

            });

            it('will return empty array if no matches found',function(){

                var mcs = conditioner.getModules('mock/modules/trololo');
                expect(mcs.length).to.equal(0);

            });

        });

        describe('test(conditions)',function(){

            beforeEach(function(){

                conditioner.setOptions({
                    'paths':{
                        'monitors':'mock/monitors/'
                    }
                });

            });

            it('will throw an error when no test passed',function(){

                var testIt = function(){conditioner.test();};
                expect(testIt).to.throw(Error);

            });

            it('will return a promise',function(){

                expect(conditioner.test('single:{true}').then).to.be.defined;

            });

            it('will call resolve method on test assertion success',function(done){

                conditioner.test('single:{true}').then(
                    function(){ // true
                        done();
                    },
                    function() { // false

                    }
                );

            });

            it('will call reject method on test assertion failure',function(done){

                conditioner.test('single:{false}').then(
                    function(){ // true

                    },
                    function() { // false
                        done();
                    }
                );

            });

        });

    });

});