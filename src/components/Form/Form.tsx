import styles from './Form.module.css'
import { countries } from "../../data/countries";

export default function Form() {
    return (
        <form className={ styles.form }>
            <div className={ styles.field }>
                <label htmlFor="">Ciudad</label>
                <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Ciudad" />
            </div>

            <div className={ styles.field }>
                <label htmlFor="">Pais:</label>
                <select name="" id="">
                    <option value="">Seleccione un pais</option>
                    {countries.map((countrie) => (
                        <option
                            key={countrie.code}
                            value={countrie.code} >
                            {countrie.name} </option>
                    ))}
                </select>
            </div>

            <input className={ styles.submit } type="submit" value={'Consultar clima'} />
        </form>
    )
}