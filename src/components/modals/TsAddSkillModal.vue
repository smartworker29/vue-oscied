<template>
  <div class="ccr-confirm">
    <h2 class="ccr-modal__title">{{ $t('ts.modal.add_new_skill') }}</h2>
    <span>{{ categoriesTitles }}</span>
    <form class="form">
      <div class="form-group row">
        <p class="error" v-if="modalError">{{ modalError }}</p>
        <select :value="skillForm.category" @change="getSkillByCategory" class="form-control">
          <option v-for="category in categories" :key="category" :value="category">
            {{ $t(`icoach.categories.${category}`) }}
          </option>
        </select>

        <select :value="skillForm.skillId" v-if="skills.length" @change="updateSkill" class="form-control">
          <option v-for="skill in skills" :key="skill.id" :value="skill.id">
            {{  skill.name }}
          </option>
        </select>
      </div>
    </form>
    <div class="ccr-modal__actions ccr-modal__actions-right">
      <button class="btn btn-primary" @click="$emit('cancel')">{{ $t('button_g.cancel') }}</button>
      <button class="btn btn-primary btn-primary-active" @click="submit" :disabled="isConfirmDisabled">{{ $t('button_g.confirm') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IcoachCategoriesEnum, IcoachSkillForm, IcoachSkillShortInfo } from '@/interfaces'
import IcoachService from '@/services/IcoachService'

@Component({ name: 'TsAddSkillModal' })
export default class TsAddSkillModal extends Vue {
  @Prop({ default: '' })
  title!: string

  @Prop({ default: '' })
  modalError!: string

  isConfirmDisabled: boolean = true
  skillForm: IcoachSkillForm = { category: 0, skillId: 0 }
  skills: IcoachSkillShortInfo[] = []

  async submit () {
    await this.$validator.validateAll()

    this.$emit('confirm', this.skillForm)
  }

  get categories (): IcoachCategoriesEnum[] {
    let skillCategories:IcoachCategoriesEnum[] = []

    for (let value in IcoachCategoriesEnum) {
      if (IcoachCategoriesEnum.hasOwnProperty(value) && typeof IcoachCategoriesEnum[value] === 'number') {
        skillCategories.push(IcoachCategoriesEnum[value] as IcoachCategoriesEnum)
      }
    }
    return skillCategories
  }

  get categoriesTitles () : string {
    return this.categories.map(category => this.$t(`icoach.categories.${category}`)).join(' / ')
  }

  async getSkillByCategory (event: Event) {
    const categorySelect = event.target as HTMLSelectElement
    const category = parseInt(categorySelect.value)

    this.skillForm.category = category
    this.skills = await IcoachService.getIcoachSkillListByCategory(category)
  }

  updateSkill (event: Event) {
    const skillSelect = event.target as HTMLSelectElement
    this.skillForm.skillId = parseInt(skillSelect.value)
    this.isConfirmDisabled = false
  }
}
</script>
