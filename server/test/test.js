const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
describe('Poker hands', () => {
    it('should return royal flush', (done) => {
        request(app)
            .get('/winner?pl[]=AC,KC&pl[]=AD,AH&t=QC,TC,JC,AS,TD')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('royalFlush');
            })
            .expect(200, done)
    })
    it('should return straight flush', (done) => {
        request(app)
            .get('/winner?pl[]=7C,8C&pl[]=AD,AH&t=5C,6C,4C,3D,TD')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('straightFlush');
            })
            .expect(200, done)
    })
    it('should return four of a kind', (done) => {
        request(app)
            .get('/winner?pl[]=7C,7D&pl[]=AD,AH&t=5C,6C,4C,7H,7S')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('fourOfAKind');
            })
            .expect(200, done)
    })
    it('should return full house', (done) => {
        request(app)
            .get('/winner?pl[]=7C,7D&pl[]=AD,AH&t=5C,5D,4C,7S,KH')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('fullHouse');
            })
            .expect(200, done)
    })
    it('should return flush', (done) => {
        request(app)
            .get('/winner?pl[]=7C,8C&pl[]=AD,AH&t=5C,6C,KH,3C,TC')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('flush');
            })
            .expect(200, done)
    })
    it('should return straight', (done) => {
        request(app)
            .get('/winner?pl[]=7C,8C&pl[]=AD,AH&t=5H,6D,4C,3D,TD')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('straight');
            })
            .expect(200, done)
    })
    it('should return three of a kind', (done) => {
        request(app)
            .get('/winner?pl[]=7C,7D&pl[]=AD,AH&t=5C,6C,7H,3C,TD')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('threeOfAKind');
            })
            .expect(200, done)
    })
    it('should return two pairs', (done) => {
        request(app)
            .get('/winner?pl[]=7C,5D&pl[]=AD,AH&t=5C,6C,7H,3C,3D')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('twoPair');
            })
            .expect(200, done)
    })
    it('should return one pair', (done) => {
        request(app)
            .get('/winner?pl[]=7C,5D&pl[]=AD,8H&t=5C,6C,TH,JC,KD')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('pair');
            })
            .expect(200, done)
    })
    it('should return high card', (done) => {
        request(app)
            .get('/winner?pl[]=7C,2D&pl[]=AD,8H&t=5C,6C,TH,JC,KD')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res._body.winners.result).to.equal('highCard');
            })
            .expect(200, done)
    })
});