<multiple-select 
    v-model="filterValue" 
    placeholder="筛选" 
    clearable>
    <multiple-option 
        v-for="(item,index) in filterList" 
        :key="index" 
        :value="item.value" 
        :label="item.label">
    </multiple-option>
</multiple-select>

import multipleSelect from '@/wm-components/components/multiple-select'
import multipleOption from '@/wm-components/components/multiple-select/option'
components:{multipleSelect,multipleOption}