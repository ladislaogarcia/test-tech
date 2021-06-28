import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { axios } from '@bundled-es-modules/axios';
import { TableExpenditures } from 'table-expenditures';
import { FormPayments } from 'form-payments';
import { FilterTransactions } from 'filter-transactions';
import { GraphAnalysis } from 'graph-analysis';  

export class IngTech extends ScopedElementsMixin(LitElement) {

    constructor() {
        super();
        this.API = {
            URL: 'http://localhost:3000',
            ENDPOINTS: {
                LATEST: 'latest',
                MONTHLY: 'monthly',
                ADD: 'add'
            }
        }
        this.list = [];
        this.headers = {
            id: 'TxnId',
            description: 'Desc',
            category: 'Category',
            date: 'Date',
            amount: 'Amount',
            type: 'M/R',
            cardType: 'D/C'
        };
        this.filteredList = [];
        this.setFilter = this.setFilter.bind(this);
        this.handleList = this.handleList.bind(this);
        this.categories = [
            'Medical',
            'Travel',
            'Loans',
            'Utility_Bills',
            'Education',
            'Shopping',
            'Misc'
        ];
    }

    static get scopedElements() {
        return {
            'form-payments': FormPayments,
            'filter-transactions': FilterTransactions,
            'table-expenditures': TableExpenditures,
            'graph-analysis': GraphAnalysis
        };
    }

    static get properties() {
        return { 
            headers: Array,
            list: Array
        };
      }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                width: 100vw;
                height: auto;
                box-sizing: border-box;
                font-weight: 700;
            }

            #error {
                height: 0;
                overflow: hidden;
                background: rgba(255,0,0,.5);                
                color: white;
                transition: all .3s ease-in;
            }

            #error p {
                padding: 0 20px;
                box-sizing: border-box;
            }

            #error.opened {
                height: 3.4rem;
                border: 2px solid red;
                border-radius: 10px;
            }

            main {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                grid-auto-rows: minmax(100px, auto);
                grid-gap: 10px;
            }

            .section-header {
                line-height: 1.6rem;
                padding: 6px 1rem;
                box-sizing: border-box;
                background: var(--bg-color-dark);
                color: white;
                display: block;
                width: 100%;
            }

            section {
                grid-column: 1/4;
                width: 100%;
                justify-content: center;
                align-items: center;                
            }

            [data-tag-name="filter-transactions"] {
                position: relative;
                top: -.75rem;
            }

            #table-expenditures {
                max-height: 20.5rem;
                overflow: hidden;
                overflow-y: hidden;
                overflow-y: auto;
            }

            .table-wrapper {
                overflow: auto;
            }

            #graph-analysis {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            @media all and (min-width: 800px) {
                main {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-gap: 10px;
                }
        
                #form-payments {
                    grid-column: 1/2;
                    grid-row: 1/5;
                }

                #filter-transactions {
                    grid-column: 2/4;
                    grid-row: 1/2;
                }

                #table-expenditures {
                    grid-column: 2/3;
                    grid-row: 2/5;
                }

                #graph-analysis {
                    grid-column: 3/4;
                    grid-row: 2/5;
                }
            }
    `
    }

    static getData() {     
        return new Promise((resolve, reject) =>  {
            axios.get(`${this.API.URL}/`)
                .then(response => resolve(response.data))
                .catch( err => reject(err));
        });
    }

    getLatest() {
        return new Promise((resolve, reject) =>  {
            let endpoint = `${this.API.URL}/${this.API.ENDPOINTS.LATEST}/`;
            if( this.filter && this.filter.category !== '' ) endpoint = `${endpoint}${this.filter.category}`;
            axios.get(endpoint)
                .then(response => resolve(response.data))
                .catch( err => reject(err));
        });
    }

    static getMonthly(month, year, category) {        
        return axios.get(`${this.API.URL}/${this.API.ENDPOINTS.MONTHLY}/${year}/${month}/${category}`);
    }

    expensesGroupedByCategories(arr) {        
        return new Promise((resolve, reject) => {
            const cats = {}
            Object.values(this.categories).forEach( category => {
                cats[category.toLowerCase()] = 0;
            })
            if( !Array.isArray(arr) ) reject();
            const maxLoop = arr.length - 1;
            for(let i=0; i<=maxLoop; i+=1) {
                const item = arr[i];
                const keyValue = item.category;
                if( item.type === 'M' ) cats[keyValue] += parseInt(item.amount, 10);
                if(i === maxLoop) {
                    resolve(cats);
                }
            }
        })
    }

    static getDataFromServer() {
        return new Promise((resolve, reject) => {            
            axios.get(`${this.API.URL}/`)
                .then(response => resolve(response.data))
                .catch( err => reject(err));
        })        
    }

    setFilter(filter) {
        this.filter = {...filter} || {};
        this.handleList();
    }

    listCurrents() {
        return new Promise((resolve, reject) => {
            this.getLatest()
            .then( items => resolve(items))
            .catch( err => reject(err));
        })
    }

    listMonthly(params) {
        return new Promise(resolve => {
            const { month, year} = params;
            const list = [...this.list.filter(item => {
                const itemDate = new Date(item.date);
                const minDate = new Date(year, month - 1, 1);
                const maxDate = new Date(year, month, 0);
                return itemDate >= minDate && itemDate <= maxDate;
            })];
            resolve(list);
        });
    }

    async filterList() {
        if( this.filter.frequency === 'current' ) {
            const items = await this.listCurrents()
            this.list = [...items];
            return items
        }
        const params = this.filter.month.split(' ');
        const newList = await this.listMonthly({
            month: params[0],
            year: params[1]
        });
        return newList;
    }

    async setChartData() {
        const colors = [
            'rgb(200, 100, 100)',
            'rgb(200, 50, 100)',
            'rgb(220, 100, 130)',
            'rgb(140, 60, 10)',
            'rgb(110, 60, 100)',
            'rgb(50, 100, 200)',
            'rgb(140, 200, 10)'
        ]
        const grouped = await this.expensesGroupedByCategories(this.filteredList);
        const elem = this.shadowRoot.querySelector('[data-tag-name="graph-analysis"]')
        elem.setData(Object.values(grouped));
        elem.setLabels(this.categories);
        elem.setColors(colors); 
    }

    async handleList() {
        const data = await this.filterList();       
        this.filteredList = data.map( item => {
                const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
                const obj = {...item};
                obj.date = new Date(item).toLocaleString();
                obj.type = item.type === 'make' ? 'M' : 'R';
                obj.category = item.category.split('_').join(' ');
                obj.date = new Intl.DateTimeFormat(navigator.language, dateOptions).format(new Date(item.date)).split(/\//).reverse().join('-');
                return obj;
            }).filter(item => this.filter.category === 'all' || this.filter.category === item.category);        
        this.setChartData();
        this.requestUpdate();
    }

    saveData(data) {
        const outcomes = this.list.filter(item => item.type === 'make').reduce((acc, item) => acc + item.amount,0);
        const incomes = this.list.filter(item => item.type === 'receive').reduce((acc, item) => acc + item.amount,0) + data.amount;
        const errorPanel = this.shadowRoot.querySelector('#error');
        if( outcomes > incomes && data.type.toLowerCase() === 'M' ) {
            errorPanel.classList.add('opened');
            return false;
        }
        errorPanel.classList.remove('opened');
        const obj = {...data};
        obj.cardType = 'D';
        // eslint-disable-next-line prefer-destructuring
        return axios.post(`${this.API.URL}/${this.API.ENDPOINTS.ADD}`, obj)
            .then(() => {
                this.handleList();
            })
            .catch(err => {
                throw new Error(err)
            });
    }

    render() {
        return html`
            <div id="payment-container">
                <div id="error">
                    <p>Transaction not allowed. Outcomes are bigger than incomes.</p>
                </div>
                <main>                
                <section id="form-payments">
                    <div class="section-header">Make / Receive Payments</div>

                    <form-payments .categories=${this.categories} @FORM_PAYMENTS.PAYMENT_ADDED="${e => this.saveData(e.detail)}"></form-payments>

                </section>
                <section id="filter-transactions">
                    <div class="section-header">View Transactions</div>
                    
                    <filter-transactions .categories=${this.categories} @FILTER_TRANSACTIONS.FILTER_CHANGES="${e => this.setFilter(e.detail)}"></filter-transactions>

                </section>
                <section id="table-expenditures">
                    <div class="section-header">Expenditure</div>
                    <div class="table-wrapper">
                        <table-expenditures .headers="${this.headers}" .rows="${this.filteredList}"></table-expenditures>
                    </div>
                    
                </section>
                <section id="graph-analysis">
                    <div class="section-header">Spend Analysis</div>

                    <graph-analysis .data="${this.chartData}"></graph-analysis>

                </section>
                </main>      
            </div>
        `
    }
}
