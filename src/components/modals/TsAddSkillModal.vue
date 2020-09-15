<template>
  <div class="ccr-confirm">
    <h2 class="ccr-modal__title">{{ $t('ts.modal.add_new_skill') }}</h2>
    <span>{{ categoriesTitles }}</span>
    <form class="form">
      <div class="form-group row">
        <p class="error" v-if="modalError">{{ modalError }}</p>
        <div class="form-group row form-group-select col-md-6">
          <multiselect
            v-model="category"
            name="category"
            label="label"
            track-by="value"
            :placeholder="$t('skill_category')"
            :allow-empty="false"
            :searchable="false"
            :show-labels="false"
            :options="categories"
            v-validate="'required'">
          </multiselect>
          <small class="error">{{ errors.first('category') }}</small>
        </div>

        <div class="form-group row form-group-select col-md-6">
          <multiselect
            v-if="category"
            v-model="skill"
            name="skill"
            label="name"
            track-by="id"
            :placeholder="$t('skill')"
            :searchable="false"
            :show-labels="false"
            :options="skills"
            v-validate="'required'">
          </multiselect>
          <small class="error">{{ errors.first('skill') }}</small>
        </div>

      </div>
    </form>
    <div class="ccr-modal__actions ccr-modal__actions-right">
      <button class="btn btn-primary" @click="$emit('cancel')">
        {{ $t('button_g.cancel') }}
      </button>
      <button class="btn btn-primary btn-primary-active" @click="submit">
        {{ $t('button_g.confirm') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IcoachCategories, IcoachSkillForm, IcoachSkillShortInfo } from '@/interfaces'
import IcoachService from '@/services/IcoachService'

interface CategoryOptionItem {
  value: number
  label: string
}

@Component({ name: 'TsAddSkillModal' })
export default class TsAddSkillModal extends Vue {
  @Prop({ default: '' })
  modalError!: string

  @Prop()
  groupedSkillList!: { [key: number]: IcoachSkillShortInfo[] }

  skillForm: IcoachSkillForm = { category: 0, skillId: 0 }
  skills: IcoachSkillShortInfo[] = []
  category: { name: string, value: number } | null = null
  skill: IcoachSkillShortInfo | null = null

  async submit () {
    if (!await this.$validator.validateAll()) {
      return
    }

    this.$emit('confirm', this.skillForm)
  }

  get categories (): CategoryOptionItem[] {
    return [
      {
        value: IcoachCategories.SoftSkills,
        label: this.$t(`icoach.categories.${IcoachCategories.SoftSkills}`).toString()
      },
      {
        value: IcoachCategories.EssentialBusinessSkills,
        label: this.$t(`icoach.categories.${IcoachCategories.EssentialBusinessSkills}`).toString()
      },
      {
        value: IcoachCategories.OrganisationalSkills,
        label: this.$t(`icoach.categories.${IcoachCategories.OrganisationalSkills}`).toString()
      }
    ]
  }

  get categoriesTitles () : string {
    return this.categories.map((category: CategoryOptionItem) => category.label).join(' / ')
  }

  @Watch('category')
  async categoryChanged () : Promise<void> {
    if (!this.category) {
      return
    }

    this.skillForm.category = this.category.value
    await this.uploadCategorySkills(this.skillForm.category)
  }

  @Watch('skill')
  updateSkill () : void {
    if (this.skill) {
      this.skillForm.skillId = this.skill.id
    }
  }

  async uploadCategorySkills (categoryNumber: number | null) : Promise<void> {
    if (!categoryNumber) {
      this.skills = []

      return
    }

    const skills = await IcoachService.getIcoachSkillListByCategory(categoryNumber)
    const selectedCategorySkill = this.groupedSkillList[categoryNumber]

    this.skills = !selectedCategorySkill
      ? skills
      : skills.filter(skill => selectedCategorySkill.findIndex(alreadySeleted => alreadySeleted.id === skill.id) === -1)
  }
}
</script>
