import React , {useState} from 'react'
import Header from './Header'
import ProgressBar from './ProgressBar'
import NavMenu from './NavMenu'
import ExtraTestsButtons from './ExtraTestsButtons'
import { useNavigate } from 'react-router-dom'


const ExtraTests = () => {


  const [name, setName] = useState(null);

  const navigate = useNavigate();
  const proceedToDiagnosis  = ()  =>{
    navigate('/diagnosis');
  }

    return (
        <div className='ml-72 my-8 px-8 flex flex-col gap-12'>
            <Header/>
          <ProgressBar />
          <NavMenu/>


          <form action='' className="justify-end items-end flex flex-col gap-20">
            <section className="grid grid-cols-5 place-items-stretch gap-11">

              <button className="w-48 py-12 text-wrap border text-[#2f3192] border-dashed border-[#2f3192] rounded-xl text-center" type='button' name='addNewTest'><span className='w-10 h-10 text-xl'>+</span> Add a test</button>

              <ExtraTestsButtons name={'aoa'} title={"Amplitude of Accommodation <br> (AOA)"}/>
              <ExtraTestsButtons name={'npc'} title={'Near Point of Convergence <br> (NPC)'}/>
              <ExtraTestsButtons name={'coverTest'} title={'Cover Test'}/>
              <ExtraTestsButtons name={'confrontationalVisualFieldTest'} title={'Confrontational <br> Visual Field Test'}/>
              <ExtraTestsButtons name={'vonGraefeTest'} title={'Von Graefe Test'}/>
              <ExtraTestsButtons name={'positiveRelativeAccommodation'} title={'Positive Relative <br> Accommodation'}/>
              <ExtraTestsButtons name={'negativeRelativeAccommodation'} title={'Negative Relative <br> Accommodation'}/>
              <ExtraTestsButtons name={'perimetry_visualFieldTest'} title={'Perimetry <br> (Visual Field Test)'}/>
              <ExtraTestsButtons name={'oct'} title={'Optical Coherence Tomography <br> (OCT)'}/>
              <ExtraTestsButtons name={'cornealTopography'} title={'Corneal <br> Topography'}/>
              <ExtraTestsButtons name={'pachymetry'} title={'Pachymetry'}/>
              <ExtraTestsButtons name={'colorVisionTesting'} title={'Color Vision <br> Testing'}/>
              <ExtraTestsButtons name={'gonioscopy'} title={'Gonioscopy'}/>
              <ExtraTestsButtons name={'keratometry'} title={'Keratometry'}/>
              <ExtraTestsButtons name={'abScan'} title={'A-Scan <br> or <br> B-Scan'}/>
              <ExtraTestsButtons name={'fluoresceinAngiography'} title={'Fluorescein <br> Angiography'} />
              <ExtraTestsButtons name={'cornealTopography'} title={'Corneal <br> Topography'} />
              <ExtraTestsButtons name={'gonioscopy'} title={'Gonioscopy'} />
              <ExtraTestsButtons name={'oct_a'} title={'OCT-A'}/>
            </section>
            <button className="w-56 h-14 p-4 rounded-lg bg-[#2f3192] text-white " onClick={proceedToDiagnosis}>Proceed to Diagnosis</button>
          </form>


        </div>
      )
    }

export default ExtraTests
